export enum TableNames {
    // already defined in the database
    USERS = 'users',
    PRODUCTS = 'products',
    CATEGORIES = 'categories',
    ORDERS = 'orders',
    CART_ITEMS = 'cart_items',
    CARTS = 'carts',
    SESSIONS = 'sessions',
    PROMOS = 'promos',
    DISCOUNTS = 'discounts',

    // not yet defined in the database
    REVIEWS = 'reviews',
    PAYMENTS = 'payments',
    SHIPPING_ADDRESSES = 'shipping_addresses',
    PAYMENT_METHODS = 'payment_methods',
    SHIPPING_METHODS = 'shipping_methods',
    SHIPPING_METHOD_COUNTRIES = 'shipping_method_countries',
    SHIPPING_METHOD_REGIONS = 'shipping_method_regions',
    SHIPPING_METHOD_ZONES = 'shipping_method_zones',
    SHIPPING_METHOD_ZONE_COUNTRIES = 'shipping_method_zone_countries',
    SHIPPING_METHOD_ZONE_REGIONS = 'shipping_method_zone_regions',
}