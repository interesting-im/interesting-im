-- Seed data for reading_articles table
INSERT INTO reading_articles (id, title, content, excerpt, author, category, difficulty, reading_time_minutes, word_count, is_published, published_at) VALUES
('11111111-1111-1111-1111-111111111111',
'The Little Prince - Chapter 1', 
'Once when I was six years old I saw a magnificent picture in a book, called True Stories from Nature, about the primeval forest. It was a picture of a boa constrictor in the act of swallowing an animal. Here is a copy of the drawing.

In the book it said: "Boa constrictors swallow their prey whole, without chewing it. After that they move no more. They sleep through the six months that they need for digestion."

I pondered deeply, then, over the adventures of the jungle. And after some work with a colored pencil I succeeded in making my first drawing. My Drawing Number One. I showed my masterpiece to the grown-ups, and asked them whether the drawing frightened them.

But they answered: "Frighten? Why should any one be frightened by a hat?"

My drawing was not a picture of a hat. It was a picture of a boa constrictor. But since the grown-ups were not able to understand it, I made another drawing: I drew the inside of a boa constrictor, so that the grown-ups could see it clearly. They always need to have things explained.',
'A classic tale about imagination and perception.',
'Antoine de Saint-Exupéry', 'Classic', 2, 5, 180, true, NOW()),

('22222222-2222-2222-2222-222222222222',
'A Busy Day at the Office', 
'Today was an extraordinarily busy day at the office. The morning started with a cup of coffee and a quick review of the daily tasks. By 9 AM, the first meeting was scheduled to discuss the quarterly results.

The team worked diligently throughout the morning. Sarah finished the financial report, while Michael completed the client presentation. The deadline was approaching, but everyone remained focused.

At noon, we had a brief lunch break. Some went to the cafeteria, while others preferred to eat at their desks. The conversation mostly centered around the upcoming project launch.

The afternoon brought more challenges. A client called with an urgent request, and the support team responded quickly to resolve the issue. By 5 PM, most tasks were completed, and we prepared for tomorrow.

It was a productive day, and everyone felt satisfied with the progress made.',
'A story about teamwork and productivity.',
'John Smith', 'Work', 1, 4, 150, true, NOW()),

('33333333-3333-3333-3333-333333333333',
'The Art of Cooking', 
'Cooking is both an art and a science. The art lies in the creativity and intuition that chefs bring to their dishes, while the science involves understanding ingredients, temperatures, and techniques.

Every great meal begins with fresh ingredients. The quality of your produce, meats, and spices will greatly influence the final result. Take time to select the best ingredients available.

Understanding heat is crucial. Different cooking methods require different temperatures. Simmering is done at low heat, while searing requires high heat to create a flavorful crust.

Practice makes perfect in cooking. Dont be afraid to experiment with new recipes. Even the most experienced chefs continue learning throughout their careers.

Remember to taste as you cook. Adjusting seasoning throughout the process ensures a balanced flavor profile in your final dish.',
'Learn culinary fundamentals from a master chef.',
'Chef Maria', 'Lifestyle', 2, 4, 160, true, NOW()),

('44444444-4444-4444-4444-444444444444',
'The Magic Forest',
'Deep in the heart of the ancient woods, there lived a family of fireflies. Every night, they would dance among the tall trees, their tiny lights creating a spectacular show of twinkling stars close to the ground.

One evening, a young rabbit named Rosie stumbled upon their magical display. She was so enchanted that she sat perfectly still, watching the lights swirl and spin in patterns that seemed to tell stories of olden times.

The oldest firefly, whose name was Lumina, noticed the rabbits fascination. She flew down and landed gently on Rosies nose. Welcome to our forest, she said with a warm glow. Would you like to hear the story of how we got our light?

Rosie nodded eagerly, and for the rest of the night, the fireflies told her tales of bravery, friendship, and the magic that exists in every corner of the natural world.',
'A bedtime story about stars and friendship.',
'Emma Woods', 'Story', 1, 3, 145, true, NOW()),

('55555555-5555-5555-5555-555555555555',
'The Solar System',
'Our solar system is a vast and fascinating place, consisting of the Sun and everything that orbits around it. At the center sits our star, a massive ball of hot plasma that provides light and warmth to all the planets.

Mercury is the closest planet to the Sun, followed by Venus, our sister planet with its thick, toxic atmosphere. Earth, our home, is the third planet and the only one we know of that harbors life. Mars, the red planet, has captured our imagination with its potential for human exploration.

Beyond Mars lie the gas giants: Jupiter, the largest planet with its famous Great Red Spot, and Saturn, known for its spectacular ring system. Uranus and Neptune, the ice giants, orbit at the outer edges of our solar system, their blue colors a result of methane in their atmospheres.',
'Learn about our planetary neighborhood.',
'Science Kids', 'Science', 2, 4, 155, true, NOW());

-- Add vocabulary words for the first article
INSERT INTO reading_vocabulary (article_id, word, translation, pronunciation, part_of_speech, example_sentence, difficulty) VALUES
('11111111-1111-1111-1111-111111111111', 'magnificent', '壮丽的', '/maɡˈnɪfɪsənt/', 'adjective', 'It was a magnificent picture of a jungle.', 3),
('11111111-1111-1111-1111-111111111111', 'primeval', '原始的', '/praɪˈmiːvəl/', 'adjective', 'The primeval forest was dark and mysterious.', 3),
('11111111-1111-1111-1111-111111111111', 'boa constrictor', '蟒蛇', '/ˈboʊə kənˈstrɪktər/', 'noun', 'A boa constrictor swallowed the whole animal.', 2),
('11111111-1111-1111-1111-111111111111', 'swallow', '吞咽', '/ˈswɒloʊ/', 'verb', 'The snake swallows its prey whole.', 2),
('11111111-1111-1111-1111-111111111111', 'digestion', '消化', '/daɪˈdʒestʃən/', 'noun', 'Digestion takes several months for the snake.', 3),
('11111111-1111-1111-1111-111111111111', 'jungle', '丛林', '/ˈdʒʌŋɡəl/', 'noun', 'The jungle was full of adventures.', 2),
('11111111-1111-1111-1111-111111111111', 'adventure', '冒险', '/ədˈventʃər/', 'noun', 'I pondered over the adventures of the jungle.', 2),
('11111111-1111-1111-1111-111111111111', 'masterpiece', '杰作', '/ˈmæstərpiːs/', 'noun', 'I showed my masterpiece to the grown-ups.', 3),
('11111111-1111-1111-1111-111111111111', 'frighten', '使惊吓', '/ˈfraɪtən/', 'verb', 'Did the drawing frighten you?', 2);

-- Add vocabulary for the second article
INSERT INTO reading_vocabulary (article_id, word, translation, pronunciation, part_of_speech, example_sentence, difficulty) VALUES
('22222222-2222-2222-2222-222222222222', 'extraordinarily', '非常地', '/ɪkˈstrɔːrdənerəli/', 'adverb', 'It was an extraordinarily busy day.', 3),
('22222222-2222-2222-2222-222222222222', 'quarterly', '季度的', '/ˈkwɔːrtərli/', 'adjective', 'We discussed the quarterly results.', 3),
('22222222-2222-2222-2222-222222222222', 'diligently', '勤奋地', '/ˈdɪlɪdʒəntli/', 'adverb', 'The team worked diligently.', 2),
('22222222-2222-2222-2222-222222222222', 'cafeteria', '自助餐厅', '/ˌkæfəˈtɪriə/', 'noun', 'Some went to the cafeteria for lunch.', 2),
('22222222-2222-2222-2222-222222222222', 'launch', '发布', '/lɔːntʃ/', 'noun', 'The project launch is next week.', 2);

-- Add vocabulary for the third article
INSERT INTO reading_vocabulary (article_id, word, translation, pronunciation, part_of_speech, example_sentence, difficulty) VALUES
('33333333-3333-3333-3333-333333333333', 'creativity', '创造力', '/ˌkriːeɪˈtɪvəti/', 'noun', 'Cooking requires creativity.', 3),
('33333333-3333-3333-3333-333333333333', 'intuition', '直觉', '/ˌɪntuˈɪʃən/', 'noun', 'Chefs use their intuition.', 3),
('33333333-3333-3333-3333-333333333333', 'ingredient', '配料', '/ɪnˈɡriːdiənt/', 'noun', 'Fresh ingredients are important.', 2),
('33333333-3333-3333-3333-333333333333', 'temperature', '温度', '/ˈtemprətʃər/', 'noun', 'Temperature is crucial in cooking.', 2),
('33333333-3333-3333-3333-333333333333', 'simmer', '小火炖', '/ˈsɪmər/', 'verb', 'Simmer the soup on low heat.', 2),
('33333333-3333-3333-3333-333333333333', 'searing', '煎烤', '/ˈsɪrɪŋ/', 'noun', 'Searing creates a flavorful crust.', 3),
('33333333-3333-3333-3333-333333333333', 'seasoning', '调味', '/ˈsiːzənɪŋ/', 'noun', 'Add seasoning to taste.', 2);

-- Add vocabulary for the fourth article
INSERT INTO reading_vocabulary (article_id, word, translation, pronunciation, part_of_speech, example_sentence, difficulty) VALUES
('44444444-4444-4444-4444-444444444444', 'enchant', '使着迷', '/ɪnˈtʃænt/', 'verb', 'She was enchanted by the display.', 2),
('44444444-4444-4444-4444-444444444444', 'spectacular', '壮观的', '/spekˈtækjələr/', 'adjective', 'The fireworks were spectacular.', 2),
('44444444-4444-4444-4444-444444444444', 'twinkling', '闪烁的', '/ˈtwɪŋklɪŋ/', 'adjective', 'The twinkling stars filled the sky.', 1),
('44444444-4444-4444-4444-444444444444', 'bravery', '勇敢', '/ˈbreɪvəri/', 'noun', 'Stories of bravery inspired the children.', 2);

-- Add vocabulary for the fifth article
INSERT INTO reading_vocabulary (article_id, word, translation, pronunciation, part_of_speech, example_sentence, difficulty) VALUES
('55555555-5555-5555-5555-555555555555', 'solar system', '太阳系', '/ˈsoʊlər ˈsɪstəm/', 'noun', 'Our solar system has eight planets.', 1),
('55555555-5555-5555-5555-555555555555', 'orbit', '轨道', '/ˈɔːrbɪt/', 'noun', 'The moon orbits the Earth.', 2),
('55555555-5555-5555-5555-555555555555', 'plasma', '等离子体', '/ˈplæzmə/', 'noun', 'The sun is made of hot plasma.', 3),
('55555555-5555-5555-5555-555555555555', 'atmosphere', '大气层', '/ˈætməsfɪr/', 'noun', 'Earth has a protective atmosphere.', 2),
('55555555-5555-5555-5555-555555555555', 'giant', '巨人', '/ˈdʒaɪənt/', 'noun', 'Jupiter is a gas giant.', 1);
