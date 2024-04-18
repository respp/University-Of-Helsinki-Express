const { test, describe } = require('node:test')
const assert = require('node:assert')
const totalLikes = require('../utils/list_helper').totalLikes

describe('totalLikes', () => {
    it('devuelve la suma correcta de los likes de los blogs', () => {
      const blogs = [
        { title: 'Blog 1', author: 'Autor 1', url: 'http://blog1.com', likes: 10 },
        { title: 'Blog 2', author: 'Autor 2', url: 'http://blog2.com', likes: 5 },
        { title: 'Blog 3', author: 'Autor 3', url: 'http://blog3.com', likes: 15 }
      ];
  
      const resultado = listHelper.totalLikes(blogs);
      assert.strictEqual(resultado, 30);
    });
  });

//   "of empty list is zero" -> "de una lista vacía es cero"
//   "when list has only one blog equals the likes of that" ->
//   "cuando la lista tiene solo un blog, equivale a los likes de ese"

//   "of a bigger list is calculated right" -> "de una lista más grande se calcula correctamente"
