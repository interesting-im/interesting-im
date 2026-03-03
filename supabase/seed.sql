-- Seed data for 3 articles
INSERT INTO articles (title, content, author, category, is_published, published_at, reading_level, word_count) VALUES
('The Little Prince - Chapter 1', 
'Once when I was six years old I saw a magnificent picture in a book, called True Stories from Nature, about the primeval forest. It was a picture of a boa constrictor in the act of swallowing an animal. Here is a copy of the drawing.

In the book it said: "Boa constrictors swallow their prey whole, without chewing it. After that they move no more. They sleep through the six months that they need for digestion."

I pondered deeply, then, over the adventures of the jungle. And after some work with a colored pencil I succeeded in making my first drawing. My Drawing Number One. I showed my masterpiece to the grown-ups, and asked them whether the drawing frightened them.

But they answered: "Frighten? Why should any one be frightened by a hat?"

My drawing was not a picture of a hat. It was a picture of a boa constrictor. But since the grown-ups were not able to understand it, I made another drawing: I drew the inside of a boa constrictor, so that the grown-ups could see it clearly. They always need to have things explained.',
'Antoine de Saint-Exupéry', 'Reading', true, NOW(), 2, 180),

('A Busy Day at the Office', 
'Today was an extraordinarily busy day at the office. The morning started with a cup of coffee and a quick review of the daily tasks. By 9 AM, the first meeting was scheduled to discuss the quarterly results.

The team worked diligently throughout the morning. Sarah finished the financial report, while Michael completed the client presentation. The deadline was approaching, but everyone remained focused.

At noon, we had a brief lunch break. Some went to the cafeteria, while others preferred to eat at their desks. The conversation mostly centered around the upcoming project launch.

The afternoon brought more challenges. A client called with an urgent request, and the support team responded quickly to resolve the issue. By 5 PM, most tasks were completed, and we prepared for tomorrow.

It was a productive day, and everyone felt satisfied with the progress made.',
'John Smith', 'Work', true, NOW(), 1, 150),

('The Art of Cooking', 
'Cooking is both an art and a science. The art lies in the creativity and intuition that chefs bring to their dishes, while the science involves understanding ingredients, temperatures, and techniques.

Every great meal begins with fresh ingredients. The quality of your produce, meats, and spices will greatly influence the final result. Take time to select the best ingredients available.

Understanding heat is crucial. Different cooking methods require different temperatures. Simmering is done at low heat, while searing requires high heat to create a flavorful crust.

Practice makes perfect in cooking. Dont be afraid to experiment with new recipes. Even the most experienced chefs continue learning throughout their careers.

Remember to taste as you cook. Adjusting seasoning throughout the process ensures a balanced flavor profile in your final dish.',
'Chef Maria', 'Lifestyle', true, NOW(), 2, 160);

-- Add vocabulary words for the first article
INSERT INTO vocabulary (word, translation, pronunciation, part_of_speech, example_sentence, difficulty) VALUES
('magnificent', '壮丽的', /maɡˈnɪfɪsənt/, adjective, 'It was a magnificent picture of a jungle.', 3),
('primeval', '原始的', /praɪˈmiːvəl/, adjective, 'The primeval forest was dark and mysterious.', 3),
('boa constrictor', '蟒蛇', /ˈboʊə kənˈstrɪktər/, noun, 'A boa constrictor swallowed the whole animal.', 2),
('swallow', '吞咽', /ˈswɒloʊ/, verb, 'The snake swallows its prey whole.', 2),
('digestion', '消化', /daɪˈdʒestʃən/, noun, 'Digestion takes several months for the snake.', 3),
('jungle', '丛林', /ˈdʒʌŋɡəl/, noun, 'The jungle was full of adventures.', 2),
('adventure', '冒险', /ədˈventʃər/, noun, 'I pondered over the adventures of the jungle.', 2),
('masterpiece', '杰作', /ˈmæstərpiːs/, noun, 'I showed my masterpiece to the grown-ups.', 3),
('frighten', '使惊吓', /ˈfraɪtən/, verb, 'Did the drawing frighten you?', 2);

-- Add vocabulary for the second article
INSERT INTO vocabulary (word, translation, pronunciation, part_of_speech, example_sentence, difficulty) VALUES
('extraordinarily', '非常地', /ɪkˈstrɔːrdənerəli/, adverb, 'It was an extraordinarily busy day.', 3),
('quarterly', '季度的', /ˈkwɔːrtərli/, adjective, 'We discussed the quarterly results.', 3),
('diligently', '勤奋地', /ˈdɪlɪdʒəntli/, adverb, 'The team worked diligently.', 2),
('cafenor', '自助餐厅', /ˈkæfɪˈtɪərɪə/, noun, 'Some went to the cafeteria for lunch.', 2),
('launch', '发布', /lɔːntʃ/, noun, 'The project launch is next week.', 2);

-- Add vocabulary for the third article
INSERT INTO vocabulary (word, translation, pronunciation, part_of_speech, example_sentence, difficulty) VALUES
('creativity', '创造力', /ˌkriːeɪˈtɪvəti/, noun, 'Cooking requires creativity.', 3),
('intuition', '直觉', /ˌɪntuˈɪʃən/, noun, 'Chefs use their intuition.', 3),
('ingredient', '配料', /ɪnˈɡriːdiənt/, noun, 'Fresh ingredients are important.', 2),
('temperature', '温度', /ˈtemprətʃər/, noun, 'Temperature is crucial in cooking.', 2),
('simmer', '小火炖', /ˈsɪmər/, verb, 'Simmer the soup on low heat.', 2),
('searing', '煎烤', /ˈsɪrɪŋ/, noun, 'Searing creates a flavorful crust.', 3),
('seasoning', '调味', /ˈsiːzənɪŋ/, noun, 'Add seasoning to taste.', 2);
