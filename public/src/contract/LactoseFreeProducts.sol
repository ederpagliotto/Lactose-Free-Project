// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract LactoseFreeProducts {
    struct Product {
        string name;
        string manufacturer;
        string details;
        bool isVerified;
    }

    mapping(uint256 => Product) public products;
    uint256 public productCount;

    function registerProduct(
        string memory _name,
        string memory _manufacturer,
        string memory _details
    ) public {
        productCount++;
        products[productCount] = Product(_name, _manufacturer, _details, false);
    }

    function verifyProduct(uint256 _productId) public {
        Product storage product = products[_productId];
        product.isVerified = true;
    }

    function getProduct(
        uint256 _productId
    ) public view returns (string memory, string memory, string memory, bool) {
        Product storage product = products[_productId];
        return (
            product.name,
            product.manufacturer,
            product.details,
            product.isVerified
        );
    }
}
