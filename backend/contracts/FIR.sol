// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;


contract FIRSystem {
    address public immutable owner;

    enum Status {Pending, Accepted, Rejected}

    struct Complaint {
        string complaintId;

        //VictimInfo
        address complainant;
        string complaintType;
        string description;
        string[] proofURIs;
        string location;
        uint64 contactNumber;
        string victimSignatureURI;

        //Others
        Status status;
        string severity;

        //PoliceInfo
        address policeStation;
        string policeSignatureURI;
        string rejectionReason;

        //TimeStamps
        uint40 recordedTimestamp;  
        uint40 lastUpdatedTimestamp;
        uint40 processedTimestamp; 
    }

    // struct InputComplaintData{
    //     string _complaintType;
    //     string _description;
    //     string[] _initialProofURIs;
    //     string _victimSignatureURI;
    //     string _severity;
    //     string _location;
    //     uint8 _contactNumber;
    // }

    uint32 public complaintCount;
    mapping(uint32 => Complaint) public complaints;
    mapping(string => uint32) public complaintIds;
    mapping(address => bool) public policeStations;

    event ComplaintFiled(string indexed complaintId, address indexed complainant, string complaintType, string description, string severity, uint40 timestamp);
    event EvidenceAdded(string indexed complaintId, string[] proofURIs);
    event ComplaintAccepted(string indexed complaintId, address indexed policeStation, string policeSignatureURI, uint40 timestamp);
    event ComplaintRejected(string indexed complaintId, address indexed policeStation, string rejectionReason, uint40 timestamp);

    modifier onlyPolice() {
        // if (!policeStations[msg.sender]) revert NotPoliceStation();
        require(policeStations[msg.sender], "Not a registered police station");
        _;
    }

    modifier onlyOwner() {
        // if (msg.sender != owner) revert NotOwner();
        require(msg.sender == owner, "Not the owner");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function addPoliceStation(address _station) external onlyOwner {
        policeStations[_station] = true;
    }

    function removePolice(address _station) external onlyOwner {
        policeStations[_station] = false;
    }

    bytes1 private constant DIGIT_0 = bytes1(uint8(48));
    bytes private constant PREFIX = bytes("COMP-");

    function generateComplaintId(uint32 _count, uint40 _timestamp) internal pure returns (string memory) {
        // Convert timestamp + count to bytes
        bytes memory countBytes = uintToBytes(_timestamp + _count);
        
        // Concatenate "COMP-" with the bytes
        bytes memory result = new bytes(PREFIX.length + countBytes.length);
        
        uint i;
        for (i = 0; i < PREFIX.length; i++) {
            result[i] = PREFIX[i];
        }
        
        for (uint j = 0; j < countBytes.length; j++) {
            result[i + j] = countBytes[j];
        }
        
        return string(result);
    }

    function uintToBytes(uint _value) internal pure returns (bytes memory) {
        if (_value == 0) return bytes("0");
        
        uint temp = _value;
        uint digits;
        while (temp != 0) {
            digits++;
            temp /= 10;
        }
        
        bytes memory buffer = new bytes(digits);
        while (_value != 0) {
            digits -= 1;
            buffer[digits] = bytes1(uint8(48 + _value % 10));
            _value /= 10;
        }
        
        return buffer;
    }

    function fileComplaint(
        string calldata _complaintType,
        string calldata _description,
        string[] calldata _initialProofURIs,
        string calldata _victimSignatureURI,
        string calldata _severity,
        string calldata _location,
        uint64 _contactNumber
    ) external {
        uint32 currentCount = ++complaintCount;
        uint40 currentTime = uint40(block.timestamp);
        
        string memory complaintId = generateComplaintId(currentCount, currentTime);
        complaintIds[complaintId] = complaintCount;

        complaints[currentCount] = Complaint({
            complaintId: complaintId,
            complainant: msg.sender,
            complaintType: _complaintType,
            description: _description,
            proofURIs: _initialProofURIs,
            victimSignatureURI: _victimSignatureURI,
            location: _location,
            contactNumber: _contactNumber,
            severity: _severity,
            policeStation: address(0),
            policeSignatureURI: "",
            status: Status.Pending,
            rejectionReason: "",
            recordedTimestamp: currentTime,
            lastUpdatedTimestamp: currentTime,
            processedTimestamp: 0
        });

        emit ComplaintFiled(complaintId, msg.sender,_complaintType,_description, _severity, currentTime);
    }

    function addEvidences(string calldata _complaintId, string[] calldata _newProofURIs) external {
        // if (_complaintId > complaintCount || _complaintId == 0) revert InvalidComplaintID();
        // require(_complaintId <= complaintCount && _complaintId != 0, "Invalid complaint ID");

        // Complaint storage complaint = complaints[_complaintId];
        
        uint32 complaintIndex = complaintIds[_complaintId];
        // if (complaintIndex == 0 || complaintIndex > complaintCount) revert InvalidComplaintID();
        require(complaintIndex != 0 && complaintIndex <= complaintCount, "Invalid complaint ID");

        Complaint storage complaint = complaints[complaintIndex];
    

        // if (complaint.complainant != msg.sender) revert OnlyComplainantCanAddEvidence();
        // if (complaint.status != Status.Pending) revert ComplaintAlreadyProcessed();
        require(complaint.complainant == msg.sender, "Only complainant can add evidence");
        require(complaint.status == Status.Pending, "Complaint already processed");

        uint originalLength = complaint.proofURIs.length;
        uint newItemsLength = _newProofURIs.length;
        
        for (uint i = 0; i < newItemsLength; i++) {
            complaint.proofURIs.push(_newProofURIs[i]);
        }

        complaint.lastUpdatedTimestamp = uint40(block.timestamp);

        emit EvidenceAdded(complaint.complaintId, _newProofURIs);
    }


    function acceptComplaint(string calldata _complaintId, string calldata _policeSignatureURI) external onlyPolice {
        uint32 complaintIndex = complaintIds[_complaintId];
        
        require(complaintIndex != 0 && complaintIndex <= complaintCount, "Invalid complaint ID");
        
        Complaint storage complaint = complaints[complaintIndex];
        
        
        require(complaint.status == Status.Pending, "Complaint already processed");

        uint40 currentTime = uint40(block.timestamp);

        complaint.policeStation = msg.sender;
        complaint.status = Status.Accepted;
        complaint.policeSignatureURI = _policeSignatureURI;
        complaint.processedTimestamp = currentTime;
        complaint.lastUpdatedTimestamp = uint40(block.timestamp);

        emit ComplaintAccepted(complaint.complaintId, msg.sender, _policeSignatureURI, currentTime);
    }

    function rejectComplaint(string calldata _complaintId, string calldata _rejectionReason) external onlyPolice {
        uint32 complaintIndex = complaintIds[_complaintId];
        // if (complaintIndex == 0 || complaintIndex > complaintCount) revert InvalidComplaintID();
        // if (bytes(_rejectionReason).length == 0) revert MustProvideRejectionReason();
                require(complaintIndex != 0 && complaintIndex <= complaintCount, "Invalid complaint ID");
                        require(bytes(_rejectionReason).length != 0, "Must provide rejection reason");


        
        Complaint storage complaint = complaints[complaintIndex];
        
        // if (complaint.status != Status.Pending) revert ComplaintAlreadyProcessed();
                require(complaint.status == Status.Pending, "Complaint already processed");


        uint40 currentTime = uint40(block.timestamp);

        complaint.policeStation = msg.sender;
        complaint.status = Status.Rejected;
        complaint.rejectionReason = _rejectionReason;
        complaint.processedTimestamp = currentTime;
        complaint.lastUpdatedTimestamp = uint40(block.timestamp);

        emit ComplaintRejected(complaint.complaintId, msg.sender, _rejectionReason, currentTime);
    }

    function getComplaintById(string calldata _complaintId) external view returns (Complaint memory) {
        for (uint32 i = 1; i <= complaintCount; i++) {
            if (keccak256(abi.encodePacked(complaints[i].complaintId)) == keccak256(abi.encodePacked(_complaintId))) {
                return complaints[i];
            }
        }
        // revert ComplaintNotFound();
                require(false, "Complaint not found");
                        return complaints[0];


    }

    function getAllComplaints() external view returns (Complaint[] memory) {
        uint32 count = complaintCount;
        Complaint[] memory allComplaints = new Complaint[](count);
        for (uint32 i = 1; i <= count; i++) {
            allComplaints[i - 1] = complaints[i];
        }
        return allComplaints;
    }

    function getComplaintsByVictim(address _victim) external view returns (Complaint[] memory) {
        uint32 count = complaintCount;
        uint32 matchCount;
        
        for (uint32 i = 1; i <= count; i++) {
            if (complaints[i].complainant == _victim) {
                matchCount++;
            }
        }

        Complaint[] memory victimComplaints = new Complaint[](matchCount);
        uint32 index;
        for (uint32 i = 1; i <= count; i++) {
            if (complaints[i].complainant == _victim) {
                victimComplaints[index++] = complaints[i];
            }
        }
        return victimComplaints;
    }

    function getComplaintsByPoliceStation(address _station) external view returns (Complaint[] memory) {
        uint32 count = complaintCount;
        uint32 matchCount;
        
        for (uint32 i = 1; i <= count; i++) {
            if (complaints[i].policeStation == _station) {
                matchCount++;
            }
        }

        Complaint[] memory stationComplaints = new Complaint[](matchCount);
        uint32 index;
        for (uint32 i = 1; i <= count; i++) {
            if (complaints[i].policeStation == _station) {
                stationComplaints[index++] = complaints[i];
            }
        }
        return stationComplaints;
    }

    
    function isPoliceStation(address _station) external view returns (bool) {
        return policeStations[_station];
    }
}
