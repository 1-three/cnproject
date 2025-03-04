// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract BillingSystem {
    address public owner;
    uint256 public meterCount;
    
    struct Meter {
        uint256 id;
        address user;
        string meterType; // electricity, water, gas
        uint256 rate; // cost per unit in wei
        bool active;
    }
    
    struct Bill {
        uint256 id;
        uint256 meterId;
        uint256 reading;
        uint256 amount;
        uint256 timestamp;
        bool paid;
    }
    
    mapping(uint256 => Meter) public meters;
    mapping(address => uint256[]) public userMeters;
    mapping(uint256 => Bill[]) public meterBills;
    
    uint256 public billCount;
    
    event MeterRegistered(uint256 indexed meterId, address indexed user, string meterType);
    event BillGenerated(uint256 indexed billId, uint256 indexed meterId, uint256 amount);
    event BillPaid(uint256 indexed billId, uint256 indexed meterId, address indexed user);
    
    constructor() {
        owner = msg.sender;
    }
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }
    
    modifier onlyMeterOwner(uint256 _meterId) {
        require(meters[_meterId].user == msg.sender, "Only meter owner can call this function");
        _;
    }
    
    function registerMeter(address _user, string memory _meterType, uint256 _rate) public onlyOwner returns (uint256) {
        meterCount++;
        
        Meter memory newMeter = Meter({
            id: meterCount,
            user: _user,
            meterType: _meterType,
            rate: _rate,
            active: true
        });
        
        meters[meterCount] = newMeter;
        userMeters[_user].push(meterCount);
        
        emit MeterRegistered(meterCount, _user, _meterType);
        
        return meterCount;
    }
    
    function generateBill(uint256 _meterId, uint256 _reading) public onlyOwner returns (uint256) {
        require(meters[_meterId].active, "Meter is not active");
        
        uint256 amount = _reading * meters[_meterId].rate;
        billCount++;
        
        Bill memory newBill = Bill({
            id: billCount,
            meterId: _meterId,
            reading: _reading,
            amount: amount,
            timestamp: block.timestamp,
            paid: false
        });
        
        meterBills[_meterId].push(newBill);
        
        emit BillGenerated(billCount, _meterId, amount);
        
        return billCount;
    }
    
    function payBill(uint256 _meterId, uint256 _billIndex) public payable onlyMeterOwner(_meterId) {
        Bill storage bill = meterBills[_meterId][_billIndex];
        
        require(!bill.paid, "Bill already paid");
        require(msg.value >= bill.amount, "Insufficient payment");
        
        bill.paid = true;
        
        // Return excess payment if any
        if (msg.value > bill.amount) {
            payable(msg.sender).transfer(msg.value - bill.amount);
        }
        
        emit BillPaid(bill.id, _meterId, msg.sender);
    }
    
    function getUserMeters(address _user) public view returns (uint256[] memory) {
        return userMeters[_user];
    }
    
    function getMeterBills(uint256 _meterId) public view returns (Bill[] memory) {
        return meterBills[_meterId];
    }
    
    function getMeterDetails(uint256 _meterId) public view returns (Meter memory) {
        return meters[_meterId];
    }
    
    function updateMeterRate(uint256 _meterId, uint256 _newRate) public onlyOwner {
        require(meters[_meterId].active, "Meter is not active");
        meters[_meterId].rate = _newRate;
    }
    
    function toggleMeterStatus(uint256 _meterId) public onlyOwner {
        meters[_meterId].active = !meters[_meterId].active;
    }
    
    function withdrawFunds() public onlyOwner {
        payable(owner).transfer(address(this).balance);
    }
}