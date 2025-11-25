// src/api/githubService.js
import axios from 'axios';

const GITHUB_BASE_URL = 'https://api.github.com';

/**
 * Handles common API response errors.
 */
const getErrorMessage = (error) => {
    if (error.response) {
        const status = error.response.status;
        const message = error.response.data?.message;

        if (status === 403 && message?.includes('rate limit')) {
            return "API Rate Limit Exceeded. Please try again later.";
        }
        return message || `HTTP error! Status: ${status}`;
    } else if (error.request) {
        return "Network Error: No response received from server.";
    }
    return `Request failed: ${error.message}`;
};

/**
 * Searches for GitHub users by username with pagination.
 */
export async function searchUsers(username, page = 1) {
    if (!username) {
        return { items: [], total_count: 0 };
    }
    const url = `${GITHUB_BASE_URL}/search/users?q=${encodeURIComponent(username)}&page=${page}&per_page=10`;

    try {
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        throw new Error(getErrorMessage(error));
    }
}

/**
 * Fetches the full details for a single GitHub user.
 */
export async function fetchUserDetails(login) {
    const url = `${GITHUB_BASE_URL}/users/${encodeURIComponent(login)}`;

    try {
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        throw new Error(getErrorMessage(error));
    }
}