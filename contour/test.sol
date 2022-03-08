pragma solidity ^0.8.0;

contract A {
    constructor(uint256 b) {}
}

contract Example is A {
    uint256 a;
    mapping(address => uint256) stuff;

    constructor(uint256 _a) A(_a) {
        a = _a;
    }

    function setStuff(address _key, uint256 _value) public {
        stuff[_key] = _value;
    }

    // function appendToStuff(uint256 element) public {
    //     stuff.push(element);
    // }
}
