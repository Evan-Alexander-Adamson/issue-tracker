'use strict';

// In-memory storage for issues
const issueStorage = {};

module.exports = function (app) {

  app.route('/api/issues/:project')
  
    .get(function (req, res){
      let project = req.params.project;
      
      // Initialize project storage if it doesn't exist
      if (!issueStorage[project]) {
        issueStorage[project] = [];
      }
      
      // Get all issues for the project
      let issues = issueStorage[project];
      
      // Extract filter parameters
      const { _id, open, issue_title, issue_text, created_by, assigned_to, status_text } = req.query;
      
      // Apply filters if they exist
      if (_id) {
        issues = issues.filter(issue => issue._id === _id);
      }
      
      if (open !== undefined) {
        issues = issues.filter(issue => issue.open === (open === 'true'));
      }
      
      if (issue_title) {
        issues = issues.filter(issue => issue.issue_title.includes(issue_title));
      }
      
      if (issue_text) {
        issues = issues.filter(issue => issue.issue_text.includes(issue_text));
      }
      
      if (created_by) {
        issues = issues.filter(issue => issue.created_by.includes(created_by));
      }
      
      if (assigned_to) {
        issues = issues.filter(issue => issue.assigned_to.includes(assigned_to));
      }
      
      if (status_text) {
        issues = issues.filter(issue => issue.status_text.includes(status_text));
      }
      
      res.json(issues);
    })
    
    .post(function (req, res){
      let project = req.params.project;
      const { issue_title, issue_text, created_by, assigned_to, status_text } = req.body;
      
      // Validate required fields
      if (!issue_title || !issue_text || !created_by) {
        return res.json({ error: 'required field(s) missing' });
      }
      
      // Initialize project storage if it doesn't exist
      if (!issueStorage[project]) {
        issueStorage[project] = [];
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
      
      // Add to storage
      issueStorage[project].push(newIssue);
      
      res.json(newIssue);
    })
    
    .put(function (req, res){
      let project = req.params.project;
      const { _id, issue_title, issue_text, created_by, assigned_to, status_text, open } = req.body;
      
      // Validate _id field
      if (!_id) {
        return res.json({ error: 'missing _id' });
      }
      
      // Initialize project storage if it doesn't exist
      if (!issueStorage[project]) {
        issueStorage[project] = [];
      }
      
      // Check if there are fields to update
      const updateFields = {};
      if (issue_title !== undefined) updateFields.issue_title = issue_title;
      if (issue_text !== undefined) updateFields.issue_text = issue_text;
      if (created_by !== undefined) updateFields.created_by = created_by;
      if (assigned_to !== undefined) updateFields.assigned_to = assigned_to;
      if (status_text !== undefined) updateFields.status_text = status_text;
      if (open !== undefined) updateFields.open = open === 'false' ? false : Boolean(open);
      
      // Check if there are fields to update
      if (Object.keys(updateFields).length === 0) {
        return res.json({ error: 'no update field(s) sent', _id });
      }
      
      // Find the issue to update
      const issueIndex = issueStorage[project].findIndex(issue => issue._id === _id);
      
      // If issue not found
      if (issueIndex === -1) {
        return res.json({ error: 'could not update', _id });
      }
      
      // Update the issue
      const updatedIssue = {
        ...issueStorage[project][issueIndex],
        ...updateFields,
        updated_on: new Date()
      };
      
      // Save the updated issue
      issueStorage[project][issueIndex] = updatedIssue;
      
      res.json({ result: 'successfully updated', _id });
    })
    
    .delete(function (req, res){
      let project = req.params.project;
      const { _id } = req.body;
      
      // Validate _id field
      if (!_id) {
        return res.json({ error: 'missing _id' });
      }
      
      // Initialize project storage if it doesn't exist
      if (!issueStorage[project]) {
        issueStorage[project] = [];
      }
      
      // Find the issue to delete
      const issueIndex = issueStorage[project].findIndex(issue => issue._id === _id);
      
      // If issue not found
      if (issueIndex === -1) {
        return res.json({ error: 'could not delete', _id });
      }
      
      // Delete the issue
      issueStorage[project].splice(issueIndex, 1);
      
      res.json({ result: 'successfully deleted', _id });
    });
    
};
