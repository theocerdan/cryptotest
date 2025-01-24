// contracts/MyNFT.sol
// SPDX-License-Identifier: MIT
pragma solidity 0.8;

import "../interfaces/IERC721.sol";

contract MyNFT is IERC721 {

    uint256 public _tokenIdCounter;

    mapping(address => uint256) private balance;

    mapping(uint256 => address) private owner;

    mapping(uint256 => address) private approval;

    mapping(address => mapping(address => bool)) private approvalForAll;

    error Unauthorized();
    error NotOwner();
    error ZeroAddress();
    error TokenNotExist();

    function balanceOf(address _owner) external view returns (uint256) {
        if (_owner == address(0)) {
            revert ZeroAddress();
        }
        return balance[_owner];
    }

    function isOwner(uint256 _tokenId, address _address) internal view returns (bool) {
        return getOwner(_tokenId) == _address;
    }

    function getOwner(uint256 _tokenId) internal view returns (address) {
        return owner[_tokenId];
    }

    function isOperator(uint256 _tokenId, address _owner, address _operator) internal view returns (bool) {
        return approvalForAll[_owner][_operator] || approval[_tokenId] == _operator;
    }

    function isValidToken(uint256 _tokenId) private view returns (bool) {
        if (_tokenId >= _tokenIdCounter) {
            return false;
        }
        return true;
    }

    function ownerOf(uint256 _tokenId) external view returns (address) {
        if (isValidToken(_tokenId)) {
            revert TokenNotExist();
        }

        return owner[_tokenId];
    }

    function transferFrom(address _from, address _to, uint256 _tokenId) external {
        address ownerAddress = getOwner(_tokenId);
        if (isValidToken(_tokenId)) {
            revert TokenNotExist();
        }

        if (_to == address(0)) {
            revert ZeroAddress();
        }

        if (_from != ownerAddress) {
            revert NotOwner();
        }

        if (!isOwner(_tokenId, msg.sender) && !isOperator(_tokenId, ownerAddress, msg.sender)) {
            revert Unauthorized();
        }

        approval[_tokenId] = address(0);

        owner[_tokenId] = _to;

        balance[_from] -= 1;
        balance[_to] += 1;

        emit Transfer(_from, _to, _tokenId);
    }

    function approve(address _approved, uint256 _tokenId) external {
        address ownerAddress = getOwner(_tokenId);
        if (!(isOwner(_tokenId, msg.sender)) || !(isOperator(_tokenId, ownerAddress, msg.sender))) {
            revert NotOwner();
        }

        approval[_tokenId] = _approved;

        emit Approval(msg.sender, _approved, _tokenId);
    }

    function setApprovalForAll(address _operator, bool _approved) external {
        approvalForAll[msg.sender][_operator] = _approved;

        emit ApprovalForAll(msg.sender, _operator, _approved);
    }

    function getApproved(uint256 _tokenId) external view returns (address) {
        return approval[_tokenId];
    }

    function isApprovedForAll(address _owner, address _operator) external view returns (bool) {
        return approvalForAll[_owner][_operator];
    }

    function mint() external returns (uint256) {
        owner[_tokenIdCounter] = msg.sender;
        balance[msg.sender] += 1;

        uint256 nftId = _tokenIdCounter;

        _tokenIdCounter = _tokenIdCounter + 1;

        return nftId;
    }

}