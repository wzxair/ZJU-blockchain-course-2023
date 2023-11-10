// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

// Uncomment the line to use openzeppelin/ERC721
// You can use this dependency directly because it has been installed by TA already
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
// Uncomment this line to use console.log
import "hardhat/console.sol";

contract BorrowYourCar is ERC721{

    uint256 constant public MAX_CAR=3;
    address[] public users;//用户
    mapping(address => uint256) claimedAirdropPlayerList;//空投列表
    address public manager;
    // use a event if you want
    // to represent time you can choose block.timestamp
    event CarBorrowed(uint256 carTokenId, address borrower, uint256 startTime, uint256 duration);

    // maybe you need a struct to store car information
    struct Car {
        address owner;
        address borrower;
        uint256 borrowUntil;
    }

    mapping(uint256 => Car) public cars; // A map from car index to its information
    mapping(address => uint256[]) public owner_cars;
    uint256[] public cars_id;//存储所有tokenid
    uint256[] public available_cars;
    // ...
    // TODO add any variables if you want

    constructor() ERC721 ("name","symbol"){
        // maybe you need a constructor
    }

    function helloworld() pure external returns(string memory) {
        return "hello world";
    }

    // ...
    // TODO add any logic if you want
    function mintCars() external{
        require(claimedAirdropPlayerList[msg.sender]<=MAX_CAR,"No more free cars");
        uint256 newTokenId=uint256(keccak256(abi.encodePacked(block.timestamp,block.prevrandao,msg.sender)));
        _safeMint(msg.sender, newTokenId);
        Car memory car=Car(msg.sender,address(0),0);
        cars[newTokenId]=car;
        owner_cars[msg.sender].push(newTokenId);
        cars_id.push(newTokenId);
        available_cars.push(newTokenId);
        claimedAirdropPlayerList[msg.sender]++;
    }
    function borrowCar(uint256 tokenId,uint256 duration) external{
        require(cars[tokenId].owner!=address(0),"The car does not exist!");
        require(cars[tokenId].borrower==address(0),"The car has been borrowed!");
        require(cars[tokenId].owner!=msg.sender,"This is your own car!");
        cars[tokenId].borrower=msg.sender;
        cars[tokenId].borrowUntil=block.timestamp+duration;
        removeByValue(available_cars,tokenId);
        emit CarBorrowed(tokenId,msg.sender,block.timestamp,duration);
    }
    function queryOwnedCars()external view returns (uint256[] memory){
        return owner_cars[msg.sender];
    }
    function queryAvailableCars()external view returns (uint256[] memory){
        return available_cars;

    }
    function queryCarOwner(uint256 tokenId) external view returns (address){
        return cars[tokenId].owner;
    }
    function queryCarBorrower(uint256 tokenId) external view returns (address){
        return cars[tokenId].borrower;
    }

    /*编译总报错，放弃
    function findValue(uint256[] calldata array,uint256 value) public returns (uint256){
        uint index=-1;
        for(int i=0;i<array.length;i++){
            if(array[i]==value){
                index=i;
                return index;
            }
        }
        return index;
    }
    function removeAtIndex(uint256[] storage array,uint256 index) internal {
        if(index>=array.length||index<0) return;
        array[index]=array[array.length-1];
        array.pop();
    }*/
    function removeByValue(uint256[] storage array,uint256 value) internal {
        for(uint i=0;i<array.length;i++){
            if (array[i]==value) {
                array[i]=array[array.length-1];
                array.pop();
                break;
            }
        }
    }
}