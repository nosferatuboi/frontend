import React, { useState } from 'react';
import axios from 'axios';
import './LinkSpreadsheet.css';

const LinkSpreadsheet = () => {
  const [links, setLinks] = useState([]);
  const [newLink, setNewLink] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleAddLink = async () => {
    if (newLink.trim() !== '') {
      setIsLoading(true);
      try {
        const response = await axios.post('http://localhost:3001/analyze', { url: newLink });
        const { summary, audience, purpose } = response.data;
        setLinks([...links, { link: newLink, summary, audience, purpose }]);
        setNewLink('');
      } catch (error) {
        console.error('Error analyzing link:', error);
        setLinks([...links, { 
          link: newLink, 
          summary: 'Error fetching analysis', 
          audience: 'Analysis failed', 
          purpose: 'Analysis failed' 
        }]);
      }
      setIsLoading(false);
    }
  };

  const handleUndo = () => {
    if (links.length > 0) {
      setLinks(links.slice(0, -1));
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAddLink();
    }
  };

  return (
    <div className="container">
      <header className="header">
        <h1>Link Analyzer</h1>
      </header>
      <div className="input-container">
        <input
          type="text"
          value={newLink}
          onChange={(e) => setNewLink(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Paste your link here"
          disabled={isLoading}
        />
        <button 
          className="add-button" 
          onClick={handleAddLink} 
          disabled={isLoading}
        >
          {isLoading ? 'Analyzing...' : 'Add Link'}
        </button>
        <button 
          className="undo-button" 
          onClick={handleUndo} 
          disabled={links.length === 0 || isLoading}
        >
          Undo
        </button>
      </div>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Link</th>
              <th>Summary</th>
              <th>Audience</th>
              <th>Purpose</th>
            </tr>
          </thead>
          <tbody>
            {links.map((row, index) => (
              <tr key={index}>
                <td>{row.link}</td>
                <td>{row.summary}</td>
                <td>{row.audience}</td>
                <td>{row.purpose}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LinkSpreadsheet;
