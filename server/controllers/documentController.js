const Document = require('../models/DocumentModel');
const path = require('path');

const uploadDocument = async (req, res) => {
    try {
      const newDocument = new Document({
        uploader: req.user.id,
        fileName: req.file.filename,
        filePath: req.file.path,
      });
  
      await newDocument.save();
      res.json({ msg: 'Document uploaded successfully' });
    } catch (err) {
      
      res.status(500).send('Server Error');
    }
  };
  
const getPendingDocuments = async (req, res) => {
    try {
      const documents = await Document.find({ status: 'pending' });
      res.status(200).json(documents);
    } catch (err) {
      
      res.status(500).send('Server Error');
    }
 
    
  };
  const getPendingDocument = async (req, res) => {
    try {
      const document = await Document.findById(req.params.id).populate('uploader', 'name'); 
      if (!document) {
        return res.status(404).json({ msg: 'Document not found' });
      }
      res.json({
        fileName: document.fileName,
        uploader: document.uploader.name, 
        status: document.status,
      });
    } catch (err) {
     
      res.status(500).send('Server Error');
    }
  };
 
  const approveDocument = async (req, res) => {
    try {
      let document = await Document.findById(req.params.id);
      if (!document) {
        return res.status(404).json({ msg: 'Document not found' });
      }
  
      document.status = 'approved';
      document.approvedBy = req.user.id;
      document.approvedAt = Date.now();
  
      await document.save();
      res.json({ msg: 'Document approved successfully' });
    } catch (err) {
      
       res.status(500).send('Server Error');
    }
  };

module.exports={
    uploadDocument,
    approveDocument,
    getPendingDocument,
    getPendingDocuments,
}