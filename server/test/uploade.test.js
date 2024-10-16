// Mocking dependencies
const documentController = require('../controllers/documentController');
const Document = require('../models/DocumentModel');

// Mock the Document model
jest.mock('../models/DocumentModel');

describe('uploadDocument Controller', () => {
  let req, res;

  beforeEach(() => {
    // Setting up mock request and response objects
    req = {
      user: { id: 'user123' },
      file: { filename: 'testFile.pdf', path: '/uploads/testFile.pdf' },
    };
    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
  });

  afterEach(() => {
    // Clear all mocks to ensure no test affects another
    jest.clearAllMocks();
  });

  it('should upload a document successfully', async () => {
    // Mock the save method to resolve without issues
    Document.mockImplementation(() => ({
      save: jest.fn().mockResolvedValueOnce({}),
    }));

    // Call the controller
    await documentController.uploadDocument(req, res);

    // Expectations
    expect(Document).toHaveBeenCalledWith({
      uploader: 'user123',
      fileName: 'testFile.pdf',
      filePath: '/uploads/testFile.pdf',
    });
    expect(res.json).toHaveBeenCalledWith({ msg: 'Document uploaded successfully' });
  });

  it('should handle server errors', async () => {
    // Mock the save method to reject with an error
    Document.mockImplementation(() => ({
      save: jest.fn().mockRejectedValueOnce(new Error('Server Error')),
    }));

    // Call the controller
    await documentController.uploadDocument(req, res);

    // Expectations
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith('Server Error');
  });
});
