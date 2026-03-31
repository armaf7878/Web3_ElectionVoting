import axios from 'axios';
import axiosClient from './apiClient';
const BASE_URL = import.meta.env.VITE_SEVER_API_URL;
console.log("API Base URL:", BASE_URL); // Debug: Kiểm tra URL cơ sở
const AUTH_URL = `${BASE_URL}/auth`;
const ORGAN_URL = `${BASE_URL}/organizations`;
const ELECTION_URL = `${BASE_URL}/elections`;

const ConnectWallet = async (message, signature) => {
    return axios.post(`${AUTH_URL}/verify-signature`, { message, signature })
    .then(response => {
        return response.data;
    })
    .catch(error => {
        throw error;
    }); 
}; export { ConnectWallet };

const UpdateProfile = async (data) => {
    // Giả sử bạn dùng axiosClient đã cấu hình sẵn Authorization Token
    return axiosClient.put(`${AUTH_URL}/profile`, data)
        .then(response => response.data)
        .catch(error => { throw error; });
}; export { UpdateProfile };

const GetOrganizations = async () => {
    return axiosClient.get(`${ORGAN_URL}/my`)
        .then(response => response.data)
        .catch(error => { throw error; });
}; export { GetOrganizations };

const GetDetailedOrganizations = async (organizationId) => {
    return axiosClient.get(`${ORGAN_URL}/${organizationId}`)
        .then(response => response.data)
        .catch(error => { throw error; });
}; export { GetDetailedOrganizations };

const CreateOrganizations = async (name, description, memberLimit, approvalType) => {
    return axiosClient.post(`${ORGAN_URL}/create_organizations`, { name, description, memberLimit, approvalType })
        .then(response => response.data)
        .catch(error => { throw error; });
}; export { CreateOrganizations };

const JoinOrganizations = async (code) => {
    return axiosClient.post(`${ORGAN_URL}/join`, { code })
        .then(response => response.data)
        .catch(error => { throw error; });
}; export { JoinOrganizations };

const ApproveMember = async (organizationId, member_id) => {
    return axiosClient.post(`${ORGAN_URL}/approve`, { organizationId, member_id })
        .then(response => response.data)
        .catch(error => { throw error; });  
}; export { ApproveMember };

const RejectMember = async (organizationId, member_id) => {
    return axiosClient.post(`${ORGAN_URL}/reject`, { organizationId, member_id })
        .then(response => response.data)
        .catch(error => { throw error; }); 
}; export { RejectMember };

const GetElections = async (organizationId) => {
    return axiosClient.get(`${ELECTION_URL}/all/${organizationId}`)
        .then(response => response.data)
        .catch(error => { throw error; });
}; export { GetElections };

const GetDetailedElections = async (electionId) => {
    return axiosClient.get(`${ELECTION_URL}/info/${electionId}`)
        .then(response => response.data)
        .catch(error => { throw error; });
}; export { GetDetailedElections };

const CreateElection = async (organizationId, name, description, candidates, voters, startTime, endTime) => {
    return axiosClient.post(`${ELECTION_URL}/create/${organizationId}`, { name, description, candidates, voters, startTime, endTime })
        .then(response => response.data)
        .catch(error => { throw error; });  
}; export { CreateElection };

const VoteElection = async (electionId, candidate_id, private_key) => { 
    return axiosClient.post(`${ELECTION_URL}/vote/${electionId}`, { candidate_id, private_key })
        .then(response => response.data)
        .catch(error => { throw error; });
}; export { VoteElection };

const GetElectionResults = async (electionId, private_key   ) => {
    return axiosClient.post(`${ELECTION_URL}/result/${electionId}`, {private_key})
        .then(response => response.data)
        .catch(error => { throw error; });
}; export { GetElectionResults };   

const GetVoteTransactions = async (electionId) => {
    return axiosClient.get(`${ELECTION_URL}/vote_transactions/${electionId}`)
        .then(response => response.data)
        .catch(error => { throw error; });
}; export { GetVoteTransactions };

const Election_LookUp = async (tx_hash) => {
    return axiosClient.post(`${ELECTION_URL}/lookup_blockchain`, {tx_hash})
        .then(response => response.data)
        .catch(error => { throw error; });
}; export { Election_LookUp };   