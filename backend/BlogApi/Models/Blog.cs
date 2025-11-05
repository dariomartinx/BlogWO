using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Collections.Generic;

namespace BlogApi.Models
{
    public class Blog
    {
        // Primary Key
        public int BlogId { get; set; }

        // Campos normales
        public string? Url { get; set; }
        public string? Author { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.Now;

        // Relación 1:N -> un Blog tiene varios Posts
        public List<Post> Posts { get; } = new();
    }
}
