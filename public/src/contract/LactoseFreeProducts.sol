// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract LactoseFreeProducts {
    struct Product {
        uint256 id;
        string name;
        string manufacturer;
        string details;
        string[] documentHashes;
        bool isVerified;
    }

    mapping(uint256 => Product) public products;
    mapping(string => uint256) private nameToId; // Mapping from product name to product ID
    uint256 public productCount;

    function registerProduct(
        uint256 _id,
        string memory _name,
        string memory _manufacturer,
        string memory _details,
        string[] memory _documentHashes
    ) public {
        require(products[_id].id == 0, "Product ID already exists.");
        require(nameToId[_name] == 0, "Product name already exists.");

        productCount++;
        products[_id] = Product(
            _id,
            _name,
            _manufacturer,
            _details,
            _documentHashes,
            false
        );

        nameToId[_name] = _id; // Store the mapping from name to ID
    }

    function verifyProduct(uint256 _productId) public {
        Product storage product = products[_productId];
        product.isVerified = true;
    }

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
