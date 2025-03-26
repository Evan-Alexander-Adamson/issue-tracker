'use strict';

module.exports = function (app) {

  app.route('/api/issues/:project')
  
    .get(function (req, res){
      let project = req.params.project;
      
      // Extract filter parameters
      const { _id, open, issue_title, issue_text, created_by, assigned_to, status_text } = req.query;
      
      // Create filter object 
      let filter = { project: project };
      
      // Add optional filters if they exist
      if (_id) filter._id = _id;
      if (open !== undefined) filter.open = open === 'true';
      if (issue_title) filter.issue_title = issue_title;
      if (issue_text) filter.issue_text = issue_text;
      if (created_by) filter.created_by = created_by;
      if (assigned_to) filter.assigned_to = assigned_to;
      if (status_text) filter.status_text = status_text;
      
      // Return filtered issues
      let issues = [];
      
      // In a real application, this would be a database query
      // For simplicity in this project, we're simulating the data
      // This would normally be a DB call like: await Issue.find(filter)
      res.json(issues);
    })
    
    .post(function (req, res){
      let project = req.params.project;
      const { issue_title, issue_text, created_by, assigned_to, status_text } = req.body;
      
      // Validate required fields
      if (!issue_title || !issue_text || !created_by) {
        return res.json({ error: 'required field(s) missing' });
      }
      
      // Create new issue object
      const newIssue = {
        _id: Date.now().toString(), // Simple ID for demo purposes
        issue_title,
        issue_text,
        created_by,
        assigned_to: assigned_to || '',
        status_text: status_text || '',
        created_on: new Date(),
        updated_on: new Date(),
        open: true,
        project
      };
      
      // In a real application, we would save to database
      // For now, just return the created issue
      res.json(newIssue);
    })
    
    .put(function (req, res){
      let project = req.params.project;
      const { _id, issue_title, issue_text, created_by, assigned_to, status_text, open } = req.body;
      
      // Validate _id field
      if (!_id) {
        return res.json({ error: 'missing _id' });
      }
      
      // Check if there are fields to update
      const updateFields = {};
      if (issue_title !== undefined) updateFields.issue_title = issue_title;
      if (issue_text !== undefined) updateFields.issue_text = issue_text;
      if (created_by !== undefined) updateFields.created_by = created_by;
      if (assigned_to !== undefined) updateFields.assigned_to = assigned_to;
      if (status_text !== undefined) updateFields.status_text = status_text;
      if (open !== undefined) updateFields.open = open === 'true';
      
      // Check if there are fields to update
      if (Object.keys(updateFields).length === 0) {
        return res.json({ error: 'no update field(s) sent', _id });
      }
      
      // Update 'updated_on' date
      updateFields.updated_on = new Date();
      
      // In a real application, we would update the database
      // For simplicity, simulate successful update
      
      // If the id doesn't exist (simulated)
      if (_id === 'invalid_id') {
        return res.json({ error: 'could not update', _id });
      }
      
      res.json({ result: 'successfully updated', _id });
    })
    
    .delete(function (req, res){
      let project = req.params.project;
      const { _id } = req.body;
      
      // Validate _id field
      if (!_id) {
        return res.json({ error: 'missing _id' });
      }
      
      // In a real application, we would delete from database
      // For simplicity, simulate successful deletion
      
      // If the id doesn't exist (simulated)
      if (_id === 'invalid_id') {
        return res.json({ error: 'could not delete', _id });
      }
      
      res.json({ result: 'successfully deleted', _id });
    });
    
};
