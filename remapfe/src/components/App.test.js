import React from 'react';
import { render, screen } from '@testing-library/react';
import { FileInput, App } from './App';
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom';

describe("File input", () => {
    test("It should trigger the callback passed as prop from parent", () => {

        const onUpload = jest.fn();
        const file = new File([""], "filename", { type: 'text/html' });

        render(<FileInput onFileUpload={onUpload} />);

        expect(screen.getByLabelText(/Upload File:/)).toBeInTheDocument();
        const input = screen.getByLabelText(/Upload File:/);
        userEvent.upload(input, file, [{ clickInit: true, changeInit: true }]);
        expect(input.files).toHaveLength(1);
        expect(onUpload).toHaveBeenCalledTimes(1);
    });

});

describe('App', () => {
    test('renders App component', () => {

        render(<App />);

    });
});