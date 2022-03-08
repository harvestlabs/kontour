pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract ERC721Minter is ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    using SafeMath for uint256;
    Counters.Counter private _tokenIds;

    uint256 public startTime;
    uint256 public priceWei;

    string[] public candidates;

    error Unauthorized();
    error TooEarly();
    error TooLate();
    error Empty();
    event Mint(uint256 tokenId, string url, address indexed sender);

    constructor(
        string memory _name,
        string memory _symbol,
        uint256 _priceWei,
        uint256 _startTime
    ) ERC721(_name, _symbol) {
        startTime = _startTime;
        priceWei = _priceWei;
    }

    modifier onlyAfter(uint256 _time) {
        if (block.timestamp < _time) revert TooEarly();
        _;
    }

    modifier onlyBefore(uint256 _time) {
        if (block.timestamp > _time) revert TooLate();
        _;
    }

    function addBatch(string[] calldata _candidates)
        public
        onlyOwner
        onlyBefore(startTime)
    {
        for (uint256 i = 0; i < _candidates.length; i += 1) {
            candidates.push(_candidates[i]);
        }
    }

    function random() private view returns (uint256) {
        return
            uint256(
                keccak256(abi.encodePacked(block.difficulty, block.timestamp))
            );
    }

    function getTotalMined() public view returns (uint256) {
        return _tokenIds.current();
    }

    function getAllCandidates() public view returns (string[] memory) {
        return candidates;
    }

    function mintRandom() public payable {
        require(msg.value >= priceWei, "Insufficient price");

        uint256 newItemId = _tokenIds.current();
        if (candidates.length == 0) {
            revert Empty();
        }
        uint256 rand = random();
        uint256 idx = rand % candidates.length;
        string memory element = candidates[idx];
        candidates[idx] = candidates[candidates.length - 1];
        candidates.pop();

        _safeMint(msg.sender, newItemId);
        _setTokenURI(newItemId, element);

        _tokenIds.increment();
        emit Mint(newItemId, element, msg.sender);
    }
}
