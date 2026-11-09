import { beforeEach, describe, expect, it, vi } from 'vitest';

import LibraryClientUtility from '@thzero/library_client/utility/index';

import LibraryClientVueUtility from '../utility/index';

// A translator over a flat dictionary, as vue-i18n's te and t behave: t
// returns the key when there is no translation, and fills in {name}.
const translator = (messages) => ({
	te: (key) => key in messages,
	t: (key, params = {}) => (key in messages ? messages[key].replace(/\{(\w+)\}/g, (m, name) => params[name] ?? m) : key)
});

// as the server's joi validation reports a missing field
const required = (field) => ({ message: `"${field}" is required`, code: field, field, type: 'any.required' });

beforeEach(() => {
	LibraryClientUtility.$trans = translator({
		'errors.error': 'An error occurred, please try again.',
		'errors.any.required': '{field} is required.',
		'errors.fields.fameFactionId': 'Fame Faction',
		'errors.currencyEarned.any.required': 'Enter the gold earned.'
	});
});

describe('applyError', () => {
	it('uses the message for the error\'s own code first', () => {
		expect(LibraryClientVueUtility.applyError(required('currencyEarned')).message).toBe('Enter the gold earned.');
	});

	// a missing translation came back as its key: 'errors.fameFactionId.any.required'
	it('falls back to the message for its type, naming the field', () => {
		expect(LibraryClientVueUtility.applyError(required('fameFactionId')).message).toBe('Fame Faction is required.');
	});

	it('names a field it has no name for as sent', () => {
		expect(LibraryClientVueUtility.applyError(required('boon1Id')).message).toBe('boon1Id is required.');
	});

	it('falls back to the server\'s message for a type it has no message for', () => {
		const error = { message: '"number" must be less than 100', code: 'number', field: 'number', type: 'number.max' };

		expect(LibraryClientVueUtility.applyError(error).message).toBe('"number" must be less than 100');
	});

	it('falls back to the default without a message', () => {
		expect(LibraryClientVueUtility.applyError({ code: 'odd', field: 'odd', type: 'odd.type' }).message).toBe('An error occurred, please try again.');
	});

	it('keeps the field the error is for', () => {
		expect(LibraryClientVueUtility.applyError(required('fameFactionId')).field).toBe('fameFactionId');
	});
});

describe('errorMessages', () => {
	it('lists a failed response\'s messages once each', () => {
		const response = { success: false, errors: [ required('fameFactionId'), required('currencyEarned'), required('fameFactionId') ] };

		expect(LibraryClientVueUtility.errorMessages(response)).toEqual([ 'Fame Faction is required.', 'Enter the gold earned.' ]);
	});

	it('lists nothing for a response without errors', () => {
		expect(LibraryClientVueUtility.errorMessages({ success: false })).toEqual([]);
		expect(LibraryClientVueUtility.errorMessages(null)).toEqual([]);
	});
});

describe('handleError', () => {
	// the forms' TODO: a failed save said nothing beyond a notification
	it('puts the messages in the form\'s server errors', () => {
		const serverErrors = [];

		LibraryClientVueUtility.handleError(null, serverErrors, { success: false, errors: [ required('fameFactionId') ] });

		expect(serverErrors).toEqual([ 'Fame Faction is required.' ]);
	});

	it('hands field errors to an object that takes them', () => {
		const object = { setErrors: vi.fn() };

		LibraryClientVueUtility.handleError(object, [], { success: false, errors: [ required('fameFactionId') ] });

		expect(object.setErrors).toHaveBeenCalledWith({ fameFactionId: [ 'Fame Faction is required.' ] });
	});

	it('does nothing without a list to fill', () => {
		expect(() => LibraryClientVueUtility.handleError(null, null, { errors: [ required('x') ] })).not.toThrow();
	});
});
