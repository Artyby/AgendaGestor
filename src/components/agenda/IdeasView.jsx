import React, { useState } from "react";
import { Plus, Trash2 } from "lucide-react";

const IdeasView = ({ ideas, deleteIdea, setShowIdeaModal }) => {
  const categories = ["Software", "Contenido", "General"];
  const [filter, setFilter] = useState("Todas");

  const filteredIdeas =
    filter === "Todas"
      ? ideas
      : ideas.filter((idea) => idea.category === filter);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Banco de Ideas</h2>
        <button
          onClick={() => setShowIdeaModal(true)}
          className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 flex items-center gap-2"
        >
          <Plus size={18} /> Nueva Idea
        </button>
      </div>

      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setFilter("Todas")}
          className={`px-4 py-2 rounded ${
            filter === "Todas" ? "bg-purple-500 text-white" : "bg-gray-200"
          }`}
        >
          Todas
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-4 py-2 rounded ${
              filter === cat ? "bg-purple-500 text-white" : "bg-gray-200"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredIdeas.map((idea) => (
          <div
            key={idea.id}
            className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-lg border-2 border-purple-200"
          >
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-semibold bg-purple-200 text-purple-800 px-2 py-1 rounded">
                {idea.category}
              </span>
              <button
                onClick={() => deleteIdea(idea.id)}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 size={16} />
              </button>
            </div>
            <h3 className="font-bold text-lg mb-2">{idea.title}</h3>
            <p className="text-sm text-gray-700">{idea.description}</p>
          </div>
        ))}

        {filteredIdeas.length === 0 && (
          <div className="col-span-full text-center py-8 text-gray-400">
            No hay ideas en esta categoría
          </div>
        )}
      </div>
    </div>
  );
};

export default IdeasView;
