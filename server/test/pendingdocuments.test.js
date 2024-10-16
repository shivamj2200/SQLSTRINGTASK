const documentController = require('../controllers/documentController');
const Document = require('../models/DocumentModel');
jest.mock('../models/DocumentModel');

describe('getPendingDocuments', () => {
  let req, res;

  beforeEach(() => {
    req = {
      user: { id: 'approver123' },
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

  it('should return pending documents successfully', async () => {
    // Mock the find method to return an array of pending documents
    Document.find.mockResolvedValueOnce([
      { _id: 'doc1', fileName: 'file1.pdf', status: 'pending' },
      { _id: 'doc2', fileName: 'file2.pdf', status: 'pending' },
    ]);

    await documentController.getPendingDocuments(req, res);

    expect(Document.find).toHaveBeenCalledWith({ status: 'pending' });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith([
      { _id: 'doc1', fileName: 'file1.pdf', status: 'pending' },
      { _id: 'doc2', fileName: 'file2.pdf', status: 'pending' },
    ]);
  });

  it('should handle server errors', async () => {
    // Mock the find method to throw an error
    Document.find.mockRejectedValueOnce(new Error('Server Error'));

    await documentController.getPendingDocuments(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith('Server Error');
  });
});
