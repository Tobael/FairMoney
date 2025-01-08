import {get_headers} from './backend.js';

// T151
describe('get_headers', () => {
    it('returns headers with user name when user_name is provided', () => {
        const headers = get_headers('test_user');
        expect(headers.get('x-user-name')).toBe('test_user');
        expect(headers.get('Content-Type')).toBe('application/json');
        expect(headers.get('Accept')).toBe('application/json');
    });

    it('returns headers without user name when user_name is not provided', () => {
        const headers = get_headers();
        expect(headers.get('x-user-name')).toBeNull();
        expect(headers.get('Content-Type')).toBe('application/json');
        expect(headers.get('Accept')).toBe('application/json');
    });
});