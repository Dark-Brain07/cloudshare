module share_cloud::escrow {
    use std::signer;
    use std::string::String;
    use aptos_framework::coin;
    use aptos_framework::aptos_coin::AptosCoin;
    use aptos_framework::event;
    use aptos_framework::timestamp;
    use aptos_framework::account;
    use aptos_std::table::{Self, Table};

    // Error codes
    const E_NOT_SELLER: u64 = 1;
    const E_NOT_BUYER: u64 = 2;
    const E_LISTING_NOT_FOUND: u64 = 3;
    const E_ALREADY_SOLD: u64 = 4;
    const E_NOT_IN_ESCROW: u64 = 6;

    // Listing status
    const STATUS_ACTIVE: u8 = 0;
    const STATUS_SOLD: u8 = 1;
    const STATUS_COMPLETED: u8 = 2;
    const STATUS_CANCELLED: u8 = 3;

    const ESCROW_SEED: vector<u8> = b"SHARE_CLOUD_ESCROW";

    struct Listing has store, drop {
        id: u64,
        seller: address,
        buyer: address,
        blob_ref: String,
        preview_hash: String,
        name: String,
        description: String,
        price: u64,
        status: u8,
        created_at: u64,
        download_count: u64,
    }

    struct Marketplace has key {
        listings: Table<u64, Listing>,
        next_id: u64,
        escrow_balances: Table<u64, u64>,
        platform_fee_bps: u64,
        total_fees: u64,
        escrow_signer_cap: account::SignerCapability,
    }

    #[event]
    struct ListingCreated has drop, store {
        listing_id: u64,
        seller: address,
        price: u64,
    }

    #[event]
    struct FilePurchased has drop, store {
        listing_id: u64,
        buyer: address,
        seller: address,
        price: u64,
    }

    #[event]
    struct DeliveryConfirmed has drop, store {
        listing_id: u64,
        buyer: address,
        seller: address,
        amount_released: u64,
    }

    #[event]
    struct ListingCancelled has drop, store {
        listing_id: u64,
        seller: address,
    }

    fun init_module(admin: &signer) {
        let (escrow_signer, escrow_signer_cap) = account::create_resource_account(
            admin,
            ESCROW_SEED,
        );
        coin::register<AptosCoin>(&escrow_signer);

        move_to(admin, Marketplace {
            listings: table::new(),
            next_id: 1,
            escrow_balances: table::new(),
            platform_fee_bps: 250,
            total_fees: 0,
            escrow_signer_cap,
        });
    }

    public entry fun list_file(
        seller: &signer,
        blob_ref: String,
        preview_hash: String,
        name: String,
        description: String,
        price: u64,
    ) acquires Marketplace {
        let seller_addr = signer::address_of(seller);
        let marketplace = borrow_global_mut<Marketplace>(@share_cloud);
        let listing_id = marketplace.next_id;

        let listing = Listing {
            id: listing_id,
            seller: seller_addr,
            buyer: @0x0,
            blob_ref,
            preview_hash,
            name,
            description,
            price,
            status: STATUS_ACTIVE,
            created_at: timestamp::now_seconds(),
            download_count: 0,
        };

        table::add(&mut marketplace.listings, listing_id, listing);
        marketplace.next_id = listing_id + 1;

        event::emit(ListingCreated {
            listing_id,
            seller: seller_addr,
            price,
        });
    }

    public entry fun purchase_file(
        buyer: &signer,
        listing_id: u64,
    ) acquires Marketplace {
        let buyer_addr = signer::address_of(buyer);
        let marketplace = borrow_global_mut<Marketplace>(@share_cloud);

        assert!(table::contains(&marketplace.listings, listing_id), E_LISTING_NOT_FOUND);
        let listing = table::borrow_mut(&mut marketplace.listings, listing_id);
        assert!(listing.status == STATUS_ACTIVE, E_ALREADY_SOLD);

        let escrow_addr = account::get_signer_capability_address(&marketplace.escrow_signer_cap);
        let payment = coin::withdraw<AptosCoin>(buyer, listing.price);
        coin::deposit(escrow_addr, payment);

        table::add(&mut marketplace.escrow_balances, listing_id, listing.price);

        listing.buyer = buyer_addr;
        listing.status = STATUS_SOLD;

        event::emit(FilePurchased {
            listing_id,
            buyer: buyer_addr,
            seller: listing.seller,
            price: listing.price,
        });
    }

    public entry fun confirm_delivery(
        buyer: &signer,
        listing_id: u64,
    ) acquires Marketplace {
        let buyer_addr = signer::address_of(buyer);
        let marketplace = borrow_global_mut<Marketplace>(@share_cloud);

        assert!(table::contains(&marketplace.listings, listing_id), E_LISTING_NOT_FOUND);
        let listing = table::borrow_mut(&mut marketplace.listings, listing_id);
        assert!(listing.buyer == buyer_addr, E_NOT_BUYER);
        assert!(listing.status == STATUS_SOLD, E_NOT_IN_ESCROW);

        let escrowed = *table::borrow(&marketplace.escrow_balances, listing_id);
        let fee = (escrowed * marketplace.platform_fee_bps) / 10000;
        let seller_payout = escrowed - fee;

        let escrow_signer = account::create_signer_with_capability(&marketplace.escrow_signer_cap);
        let payout_coins = coin::withdraw<AptosCoin>(&escrow_signer, seller_payout);
        coin::deposit(listing.seller, payout_coins);

        marketplace.total_fees = marketplace.total_fees + fee;

        listing.status = STATUS_COMPLETED;
        listing.download_count = listing.download_count + 1;
        table::remove(&mut marketplace.escrow_balances, listing_id);

        event::emit(DeliveryConfirmed {
            listing_id,
            buyer: buyer_addr,
            seller: listing.seller,
            amount_released: seller_payout,
        });
    }

    public entry fun cancel_listing(
        seller: &signer,
        listing_id: u64,
    ) acquires Marketplace {
        let seller_addr = signer::address_of(seller);
        let marketplace = borrow_global_mut<Marketplace>(@share_cloud);

        assert!(table::contains(&marketplace.listings, listing_id), E_LISTING_NOT_FOUND);
        let listing = table::borrow_mut(&mut marketplace.listings, listing_id);
        assert!(listing.seller == seller_addr, E_NOT_SELLER);
        assert!(listing.status == STATUS_ACTIVE, E_ALREADY_SOLD);

        listing.status = STATUS_CANCELLED;

        event::emit(ListingCancelled {
            listing_id,
            seller: seller_addr,
        });
    }

    #[view]
    public fun get_listing(listing_id: u64): (address, u64, u8, u64) acquires Marketplace {
        let marketplace = borrow_global<Marketplace>(@share_cloud);
        assert!(table::contains(&marketplace.listings, listing_id), E_LISTING_NOT_FOUND);
        let listing = table::borrow(&marketplace.listings, listing_id);
        (listing.seller, listing.price, listing.status, listing.download_count)
    }
}
