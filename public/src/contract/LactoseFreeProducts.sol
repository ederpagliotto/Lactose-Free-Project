// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// Struct to represent a product
contract LactoseFreeProducts {
    struct Product {
        uint256 id;
        string name;
        string manufacturer;
        string details;
        string[] documentHashes;
        bool isVerified;
    }
    // Mapping to store products by their ID
    mapping(uint256 => Product) public products;
    // Mapping to store product ID by their name
    mapping(string => uint256) private nameToId;
    // Counter for the total number of products
    uint256 public productCount;

    // Function to register a new product
    function registerProduct(
        uint256 _id,
        string memory _name,
        string memory _manufacturer,
        string memory _details,
        string[] memory _documentHashes
    ) public {
        // Ensure the product ID and name are unique
        require(products[_id].id == 0, "Product ID already exists.");
        require(nameToId[_name] == 0, "Product name already exists.");

        //incrementing
        productCount++;
        // Add new product to the products mapping
        products[_id] = Product(
            _id,
            _name,
            _manufacturer,
            _details,
            _documentHashes,
            false
        );
        // Store the mapping from name to ID
        nameToId[_name] = _id;
    }
    // Function to verify a product by its ID
    function verifyProduct(uint256 _productId) public {
        Product storage product = products[_productId];
        product.isVerified = true;
    }

    // Function to get product details by its ID
    function getProductById(
        uint256 _productId
    )
        public
        view
        returns (
            uint256,
            string memory,
            string memory,
            string memory,
            string[] memory,
            bool
        )
    {
        Product storage product = products[_productId];
        return (
            product.id,
            product.name,
            product.manufacturer,
            product.details,
            product.documentHashes,
            product.isVerified
        );
    }

    // Function to get product details by its name
    function getProductByName(
        string memory _name
    )
        public
        view
        returns (
            uint256,
            string memory,
            string memory,
            string memory,
            string[] memory,
            bool
        )
    {
        uint256 productId = nameToId[_name];
        require(productId != 0, "Product not found.");
        Product storage product = products[productId];
        return (
            product.id,
            product.name,
            product.manufacturer,
            product.details,
            product.documentHashes,
            product.isVerified
        );
    }
}
