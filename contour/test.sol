pragma solidity ^0.8.0;

contract A {
    constructor(uint256 b) {}
}

contract Example is A {
    uint256 a;

    constructor(uint256 _a) A(_a) {
        a = _a;
    }
}
