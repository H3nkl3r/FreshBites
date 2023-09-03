# Server Endpoint Documentation

## Middleware:
- `AuthProvider.checkAuth`: Middleware to check user authentication via JWT tokens. Will make the user profile accessible via req.user
- `AuthProvider.checkRestaurantPermission`: Middleware to check if the authenticated user has permission tod do restaurant-related actions (i.e., check whether the user is the owner of a given restaurant ID)
- `upload.array` / `upload.single`: Middleware to handle file uploads using multer. Uploaded multipart form data will be temporarily stored in the server file system.
- `AuthProvider.permit`: Middleware to allow certain route calls only for specific user roles (i.e., free, premium or owner)
- `AuthProvider.checkVoucherPermission`: Middleware to check if an authenticated restaurant owner has permission for voucher-related actions (e.g., invalidating the voucher).

## Blog Routes

### **[GET]** /blog/get

**Description:** Get all blog posts by the corresponding restaurant's location or by blog type (success story or normal blog).

### **[GET]** /blog/getOne

**Description:** Get a specific blog post by its ID.

### **[GET]** /blog/getByRestaurant

**Description:** Get blog posts related to a restaurant (given the restaurant ID).

### **[POST]** /blog/create

**Description:** Create a new blog post for an existing restaurant (given the restaurant ID). Authentication the corresponding restaurant's owner is required.

### **[DELETE]** /blog/delete

**Description:** Delete a blog post given its ID. Authentication the corresponding restaurant's owner is required.

### **[POST]** /blog/uploadImage

**Description:** Upload an image for a blog post. Authentication the corresponding restaurant's owner is required.

## Favorite Routes

### **[GET]** /favorite/

**Description:** Get the list of favorite restaurants for the authenticated user.

### **[GET]** /favorite/isFavorite

**Description:** Check if a specific restaurant (given its ID) is in a user's favorites. Authentication of the corresponding user is required.

### **[PUT]** /favorite/add

**Description:** Add a restaurant to the user's favorites. Authentication of the corresponding user is required.

### **[PUT]** /favorite/remove

**Description:** Remove a restaurant from a user's favorites. Authentication of the corresponding user is required.

## Payment Routes

### **[POST]** /payment/createRestaurantPaymentSession

**Description:** Create a payment session for a restaurant owner.

### **[POST]** /payment/createUserPaymentSession

**Description:** Create a payment session for a user to upgrade from a free to a premium account.

## Restaurant Routes

### **[GET]** /restaurant/get

**Description:** Get restaurants by ID, name, area or owner ID. it is possible to specify sorting and filtering options.

### **[GET]** /restaurant/getLocationAutocomplete

**Description:** Get autocomplete suggestions for location (sub-)strings.

### **[GET]** /restaurant/getAutocompleteRestaurantName

**Description:** Get autocomplete suggestions for restaurant name (sub-)strings.

### **[POST]** /restaurant/create

**Description:** Create a new restaurant. Will be marked as inactive until payment is fulfilled.

### **[POST]** /restaurant/uploadImages

**Description:** Upload images for a restaurant. Existing images, if any, are overwritten. Authentication as the restaurant's owner is required.

### **[POST]** /restaurant/uploadMenu

**Description:** Upload a menu for a restaurant. Existing menu, if any, is overwritten. Authentication as the restaurant's owner is required.

### **[PATCH]** /restaurant/updateInformation

**Description:** Update restaurant information. Authentication as the restaurant's owner is required.

### **[PATCH]** /restaurant/click

**Description:** Increment the click count for a restaurant for billing purposes.

### **[PATCH]** /restaurant/activateRestaurant

**Description:** Activate a restaurant. This route does not need authentication middleware as authentication is done via the stripe session ID.

### **[DELETE]** /restaurant/checkToDelete

**Description:** When the payment at the end of the restaurant registration was cancelled, this route checks whether there exists an active subscription for the just created restaurant and if not, it deletes the restaurant.

### **[DELETE]** /restaurant/delete

**Description:** Delete a restaurant. Side effects: will cancel the stripe subscription, delete corresponding blogpost, corresponding reviews, corresponding review codes and update all corresponding favorites list. Authentication as the restaurant's owner is required. Also, will change the owner's role to 'free'.

## Review Routes

### **[GET]** /review/get

**Description:** Get all reviews for a given restaurant ID.

### **[POST]** /review/create

**Description:** Create a new review. Authentication as a user is required. Side effect: will increase the user's review counter.

## User Routes

### **[POST]** /user/register

**Description:** Register a new user (either free, premium or owner).

### **[POST]** /user/login

**Description:** Log in a user (either visitor or owner). Authentication using jwt token is required.

### **[PATCH]** /user/update

**Description:** Update user information. Authentication using jwt token is required.

### **[DELETE]** /user/delete

**Description:** Delete a user. Side effects: delete all corresponding reviews and favorites list. Authentication using jwt token is required.

### **[GET]** /user/me

**Description:** Get the profile information of the authenticated user.

### **[GET]** /user/checkExisting

**Description:** Check if a user with a given email already exists.

### **[PATCH]** /user/activatePremium

**Description:** Activate premium status for a user (formerly with role 'free').

### **[PATCH]** /user/unsubscribe

**Description:** Unsubscribe an authenticated user from premium features.

### **[GET]** /user/restaurantPermission

**Description:** Check if the authenticated user has permission for restaurant-related actions.

### **[GET]** /user/voucherPermission

**Description:** Check if an authenticated restaurant owner is eligible to do any further action (e.g., invalidate) regarding a specific voucher (given the voucher ID). An owner is eligible iff he is the owner of the voucher's corresponding restaurant.

### **[GET]** /user/get

**Description:** Get user information for an authenticated user.

## Voucher Routes

### **[GET]** /vouchers/loyaltyVoucherStatus

**Description:** Check if an authenticated user (either free or premium) is eligible to receive a loyalty voucher based on his current count of written reviews.

### **[GET]** /vouchers/premiumVoucherStatus

**Description:** Check if an authenticated user is eligible to receive a premium voucher based on his role and if there was a premium voucher issued in the past 30 days.

### **[GET]** /vouchers/get

**Description:** Get voucher data for a given voucher ID.

### **[PATCH]** /vouchers/invalidate

**Description:** Invalidate a given voucher based on its voucher ID. Requires authentication as the voucher's corresponding restaurant owner.

### **[POST]** /vouchers/issueLoyaltyVoucher

**Description:** Issue a loyalty voucher for an authenticated user (either free or premium). Side effects: reduce review counter by the number necessary for loyalty vouchers and send voucher to the user via email.

### **[POST]** /vouchers/issuePremiumVoucher

**Description:** Issue a loyalty voucher for an authenticated premium user. Side effects: Send voucher to the user via email.
