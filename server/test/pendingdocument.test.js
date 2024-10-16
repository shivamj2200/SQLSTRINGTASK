const documentController = require('../controllers/documentController');
const Document = require('../models/DocumentModel');
const User = require('../models/userModel'); // Changed variable name from Document to User

// Mock the Document and User models
jest.mock('../models/DocumentModel');
jest.mock('../models/userModel');

describe('getPendingDocument', () => {
  let req, res;

  beforeEach(() => {
    req = {
      params: { id: 'doc123' }, // Mocked request params
      user: { id: 'approver123' } // Mocked authenticated user
    };
    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
      send: jest.fn()
    };
  });

  afterEach(() => {
    jest.clearAllMocks(); // Reset mocks after each test
  });

  it('should return a specific pending document with uploader details', async () => {
    // Mock the findById and populate methods to return a document
    const mockDocument = {
      _id: 'doc123',
      fileName: 'file1.pdf',
      status: 'pending',
      uploader: { name: 'John Doe' }
    };

    Document.findById.mockResolvedValueOnce(mockDocument);

    await documentController.getPendingDocument(req, res);

    expect(Document.findById).toHaveBeenCalledWith('doc123');
    expect(res.json).toHaveBeenCalledWith({
      fileName: 'file1.pdf',
      uploader: 'John Doe',
      status: 'pending'
    });
  });

  it('should return 404 if the document is not found', async () => {
    // Mock findById to return null (document not found)
    Document.findById.mockResolvedValueOnce(null);

    await documentController.getPendingDocument(req, res);

    expect(Document.findById).toHaveBeenCalledWith('doc123');
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ msg: 'Document not found' });
  });

  it('should handle server errors', async () => {
    // Mock findById to throw an error
    Document.findById.mockRejectedValueOnce(new Error('Server Error'));

    await documentController.getPendingDocument(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith('Server Error');
  });
});
