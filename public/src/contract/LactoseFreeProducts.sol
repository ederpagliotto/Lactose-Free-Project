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
    uint256 public productCount;

    function registerProduct(
        uint256 _id,
        string memory _name,
        string memory _manufacturer,
        string memory _details,
        string[] memory _documentHashes
    ) public {
        productCount++;
        products[_id] = Product(
            _id,
            _name,
            _manufacturer,
            _details,
            _documentHashes,
            false
        );
    }

    function verifyProduct(uint256 _productId) public {
        Product storage product = products[_productId];
        product.isVerified = true;
    }

    function getProduct(
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
}
