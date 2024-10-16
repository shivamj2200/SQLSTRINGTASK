const documentController = require('../controllers/documentController');
const Document = require('../models/DocumentModel');

// Mock the Document model
jest.mock('../models/DocumentModel');
describe('approveDocument Controller', () => {
  let req, res;

  beforeEach(() => {
    req = {
      user: { id: 'approver123' },
      params: { id: 'document123' },
    };
    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should approve a document successfully', async () => {
    // Mock the findById method to return a document
    Document.findById.mockResolvedValueOnce({
      _id: 'document123',
      status: 'pending',
      save: jest.fn().mockResolvedValueOnce({}),
    });

    // Call the controller
    await documentController.approveDocument(req, res);

    // Expectations
    expect(Document.findById).toHaveBeenCalledWith('document123');
    expect(res.json).toHaveBeenCalledWith({ msg: 'Document approved successfully' });
  });

  it('should return 404 if the document is not found', async () => {
    // Mock the findById method to return null (document not found)
    Document.findById.mockResolvedValueOnce(null);

    // Call the controller
    await documentController.approveDocument(req, res);

    // Expectations
    expect(Document.findById).toHaveBeenCalledWith('document123');
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ msg: 'Document not found' });
  });

  it('should handle server errors', async () => {
    // Mock the findById method to throw an error
    Document.findById.mockRejectedValueOnce(new Error('Server Error'));

    // Call the controller
    await documentController.approveDocument(req, res);

    // Expectations
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith('Server Error');
  });
});
