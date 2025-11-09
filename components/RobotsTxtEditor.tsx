import React, { useState, useEffect } from 'react';
import { RobotIcon, DownloadIcon, PlusIcon, TrashIcon } from './icons';

type RuleType = 'Allow' | 'Disallow';

interface Rule {
  type: RuleType;
  path: string;
}

interface RobotsTxtEditorProps {
  baseUrl: string; // The URL from the main input
}

const RobotsTxtEditor: React.FC<RobotsTxtEditorProps> = ({ baseUrl }) => {
  const [rules, setRules] = useState<Rule[]>([
    { type: 'Disallow', path: '/admin/' },
    { type: 'Disallow', path: '/login/' },
  ]);
  const [newRuleType, setNewRuleType] = useState<RuleType>('Disallow');
  const [newRulePath, setNewRulePath] = useState('');
  const [robotsTxtContent, setRobotsTxtContent] = useState('');

  const generateContent = () => {
    let content = 'User-agent: *\n';
    rules.forEach(rule => {
      content += `${rule.type}: ${rule.path}\n`;
    });
    if (baseUrl) {
      try {
        const url = new URL(baseUrl.startsWith('http') ? baseUrl : `https://${baseUrl}`);
        content += `\nSitemap: ${url.origin}/sitemap.xml`;
      } catch (e) {
        // Ignore invalid base url for sitemap link
      }
    }
    return content;
  };
  
  useEffect(() => {
    setRobotsTxtContent(generateContent());
  }, [rules, baseUrl]);

  const handleAddRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (newRulePath.trim()) {
      setRules([...rules, { type: newRuleType, path: newRulePath.trim() }]);
      setNewRulePath('');
    }
  };

  const handleRemoveRule = (indexToRemove: number) => {
    setRules(rules.filter((_, index) => index !== indexToRemove));
  };

  const handleDownload = () => {
    const blob = new Blob([robotsTxtContent], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'robots.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  return (
    <div className="bg-gray-800 p-6 rounded-xl shadow-2xl shadow-black/20 border border-gray-700">
      <div className="flex items-center gap-4 mb-4">
        <RobotIcon className="w-8 h-8 text-teal-400" />
        <h2 className="text-2xl font-bold text-gray-200">robots.txt Editor</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Rule Management */}
        <div>
          <h3 className="text-lg font-semibold text-gray-300 mb-3">Rules</h3>
          <form onSubmit={handleAddRule} className="flex gap-2 mb-4">
            <select
              value={newRuleType}
              onChange={(e) => setNewRuleType(e.target.value as RuleType)}
              className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-teal-500 focus:outline-none"
            >
              <option>Disallow</option>
              <option>Allow</option>
            </select>
            <input
              type="text"
              value={newRulePath}
              onChange={(e) => setNewRulePath(e.target.value)}
              placeholder="/private-path/"
              className="flex-grow bg-gray-900 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:ring-2 focus:ring-teal-500 focus:outline-none transition duration-200"
            />
            <button type="submit" className="flex-shrink-0 bg-teal-600 text-white rounded-lg p-2 hover:bg-teal-700 transition duration-200" aria-label="Add Rule">
              <PlusIcon className="w-5 h-5" />
            </button>
          </form>
          <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
            {rules.map((rule, index) => (
              <div key={index} className="flex justify-between items-center bg-gray-700/50 p-2 rounded-md">
                <p className="font-mono text-sm">
                  <span className={rule.type === 'Disallow' ? 'text-red-400' : 'text-green-400'}>{rule.type}:</span>
                  <span className="text-gray-300 ml-2">{rule.path}</span>
                </p>
                <button onClick={() => handleRemoveRule(index)} className="text-gray-500 hover:text-red-400" aria-label="Remove Rule">
                    <TrashIcon className="w-4 h-4" />
                </button>
              </div>
            ))}
            {rules.length === 0 && <p className="text-gray-500 text-sm text-center py-4">No rules added yet.</p>}
          </div>
        </div>

        {/* Output */}
        <div>
           <div className="flex justify-between items-center mb-3">
             <h3 className="text-lg font-semibold text-gray-300">Generated robots.txt</h3>
              <button
                onClick={handleDownload}
                className="flex items-center gap-2 bg-green-600 text-white font-semibold rounded-lg px-3 py-1.5 text-sm hover:bg-green-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-green-500"
              >
                <DownloadIcon className="w-4 h-4" />
                Download
              </button>
           </div>
          <textarea
            readOnly
            value={robotsTxtContent}
            className="w-full h-64 bg-gray-900/50 border border-gray-700 rounded-lg p-4 font-mono text-sm text-gray-300 resize-none focus:ring-2 focus:ring-blue-500 focus:outline-none"
            aria-label="Generated robots.txt content"
          />
        </div>
      </div>
    </div>
  );
};

export default RobotsTxtEditor;