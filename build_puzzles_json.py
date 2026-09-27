import json
import os

puzzles_meta = [
    {
        "id": 1,
        "answer": "Forget it",
        "acceptable": ["forget it", "forget-it"],
        "hint": "Don't remember it; dismiss an issue",
        "category": "Common Phrase"
    },
    {
        "id": 2,
        "answer": "Try to understand",
        "acceptable": ["try to understand", "attempt to understand"],
        "hint": "Make an effort to comprehend",
        "category": "Idiom"
    },
    {
        "id": 3,
        "answer": "Travel overseas",
        "acceptable": ["travel overseas", "overseas travel", "travel over seas"],
        "hint": "Journey across international waters",
        "category": "Travel"
    },
    {
        "id": 4,
        "answer": "Downtown",
        "acceptable": ["downtown", "down town"],
        "hint": "The central commercial district",
        "category": "Places"
    },
    {
        "id": 5,
        "answer": "Eyeshadow",
        "acceptable": ["eyeshadow", "eye shadow"],
        "hint": "Cosmetic applied to the eyelids",
        "category": "Beauty"
    },
    {
        "id": 6,
        "answer": "Stepfather",
        "acceptable": ["stepfather", "step father"],
        "hint": "Parent by marriage, not biology",
        "category": "Family"
    },
    {
        "id": 7,
        "answer": "Potatoes",
        "acceptable": ["potatoes", "potato", "pot 8 os", "pot eight os"],
        "hint": "Starchy root vegetables (spuds)",
        "category": "Food"
    },
    {
        "id": 8,
        "answer": "3D movie",
        "acceptable": ["3d movie", "three d movie", "3-d movie", "3d film"],
        "hint": "Motion picture viewed with special glasses",
        "category": "Entertainment"
    },
    {
        "id": 9,
        "answer": "Top secret",
        "acceptable": ["top secret"],
        "hint": "Highest level of classified information",
        "category": "Espionage"
    },
    {
        "id": 10,
        "answer": "Lemonade",
        "acceptable": ["lemonade", "lemon ade"],
        "hint": "Sweet and tart citrus summer drink",
        "category": "Beverage"
    },
    {
        "id": 11,
        "answer": "Long legs",
        "acceptable": ["long legs"],
        "hint": "Elongated limbs",
        "category": "Anatomy"
    },
    {
        "id": 12,
        "answer": "Big bad wolf",
        "acceptable": ["big bad wolf", "the big bad wolf"],
        "hint": "Fairy tale villain that huffed and puffed",
        "category": "Fairy Tale"
    },
    {
        "id": 13,
        "answer": "Many thanks",
        "acceptable": ["many thanks", "thanks a lot", "thank you very much", "thanks thanks"],
        "hint": "Abundant gratitude",
        "category": "Courtesies"
    },
    {
        "id": 14,
        "answer": "Download",
        "acceptable": ["download", "down load"],
        "hint": "Transfer data from the cloud or web to your device",
        "category": "Technology"
    },
    {
        "id": 15,
        "answer": "Spaceman",
        "acceptable": ["spaceman", "space man", "astronaut"],
        "hint": "Traveler beyond Earth's atmosphere",
        "category": "Space"
    },
    {
        "id": 16,
        "answer": "No idea",
        "acceptable": ["no idea", "no clue", "have no idea"],
        "hint": "Complete lack of knowledge on a topic",
        "category": "Expression"
    },
    {
        "id": 17,
        "answer": "Comfortable",
        "acceptable": ["comfortable", "comfy"],
        "hint": "Providing physical ease and relaxation",
        "category": "Adjective"
    },
    {
        "id": 18,
        "answer": "Forty years",
        "acceptable": ["forty years", "40 years"],
        "hint": "Four decades of time",
        "category": "Time"
    },
    {
        "id": 19,
        "answer": "Excuse me",
        "acceptable": ["excuse me", "pardon me"],
        "hint": "Polite phrase used to get past or get attention",
        "category": "Courtesies"
    },
    {
        "id": 20,
        "answer": "Forehead",
        "acceptable": ["forehead", "fore head"],
        "hint": "Facial area between the eyebrows and hairline",
        "category": "Anatomy"
    },
    {
        "id": 21,
        "answer": "Good looking",
        "acceptable": ["good looking", "good-looking", "handsome", "attractive"],
        "hint": "Visually appealing or handsome",
        "category": "Descriptive"
    },
    {
        "id": 22,
        "answer": "Waterfall",
        "acceptable": ["waterfall", "water fall", "cascade"],
        "hint": "Cascade of river water plunging over a steep drop",
        "category": "Nature"
    },
    {
        "id": 23,
        "answer": "Wake up",
        "acceptable": ["wake up", "awake"],
        "hint": "Cease sleeping; rise and shine",
        "category": "Daily Routine"
    },
    {
        "id": 24,
        "answer": "Tuna fish",
        "acceptable": ["tuna fish", "tuna"],
        "hint": "Popular canned saltwater fish",
        "category": "Food"
    },
    {
        "id": 25,
        "answer": "Foreign language",
        "acceptable": ["foreign language", "second language"],
        "hint": "Speech native to another country",
        "category": "Communication"
    },
    {
        "id": 26,
        "answer": "Middle-aged",
        "acceptable": ["middle-aged", "middle aged"],
        "hint": "Neither young nor old, roughly 45-65",
        "category": "Life Stages"
    },
    {
        "id": 27,
        "answer": "Broken heart",
        "acceptable": ["broken heart", "heartbreak", "heart broken"],
        "hint": "Overwhelming grief from lost love",
        "category": "Emotion"
    },
    {
        "id": 28,
        "answer": "Seesaw",
        "acceptable": ["seesaw", "see-saw", "teeter totter", "teeter-totter"],
        "hint": "Playground equipment that rocks up and down",
        "category": "Playground"
    },
    {
        "id": 29,
        "answer": "Miss you",
        "acceptable": ["miss you", "missing you"],
        "hint": "Longing for someone absent",
        "category": "Emotion"
    },
    {
        "id": 30,
        "answer": "Teabag",
        "acceptable": ["teabag", "tea bag"],
        "hint": "Small porous pouch for brewing hot drinks",
        "category": "Beverage"
    },
    {
        "id": 31,
        "answer": "Four-wheel drive",
        "acceptable": ["four-wheel drive", "four wheel drive", "4-wheel drive", "4wd", "4x4"],
        "hint": "Vehicle system sending power to all wheels",
        "category": "Automotive"
    },
    {
        "id": 32,
        "answer": "Apple pie",
        "acceptable": ["apple pie"],
        "hint": "Traditional American baked pastry dessert",
        "category": "Food"
    },
    {
        "id": 33,
        "answer": "Up to you",
        "acceptable": ["up to you", "its up to you", "it's up to you"],
        "hint": "Entirely your decision",
        "category": "Common Phrase"
    },
    {
        "id": 34,
        "answer": "Robin Hood",
        "acceptable": ["robin hood"],
        "hint": "Heroic archer who steals from the rich",
        "category": "Folk Legend"
    },
    {
        "id": 35,
        "answer": "Engineer",
        "acceptable": ["engineer"],
        "hint": "Professional who designs engines or machines",
        "category": "Careers"
    },
    {
        "id": 36,
        "answer": "Vegetables",
        "acceptable": ["vegetables", "vegetable", "veggies"],
        "hint": "Carrots, broccoli, spinach, and celery",
        "category": "Food"
    },
    {
        "id": 37,
        "answer": "Afternoon tea",
        "acceptable": ["afternoon tea", "high tea"],
        "hint": "British tradition of tea and scones around 4 PM",
        "category": "Culture"
    },
    {
        "id": 38,
        "answer": "Camping overnight",
        "acceptable": ["camping overnight", "camp overnight", "overnight camping"],
        "hint": "Sleeping in the woods under a tent",
        "category": "Outdoors"
    },
    {
        "id": 39,
        "answer": "Broken heart",
        "acceptable": ["broken heart", "heartbreak"],
        "hint": "Emotional sadness caused by heartbreak",
        "category": "Emotion"
    },
    {
        "id": 40,
        "answer": "Time to go",
        "acceptable": ["time to go", "it's time to go", "its time to go"],
        "hint": "Moment to pack up and leave",
        "category": "Common Phrase"
    },
    {
        "id": 41,
        "answer": "Long time no see",
        "acceptable": ["long time no see"],
        "hint": "Greeting between friends who haven't met in ages",
        "category": "Greeting"
    },
    {
        "id": 42,
        "answer": "Polite",
        "acceptable": ["polite", "courteous", "mannerly"],
        "hint": "Displaying good manners and respect",
        "category": "Adjective"
    },
    {
        "id": 43,
        "answer": "Touchdown",
        "acceptable": ["touchdown", "touch down"],
        "hint": "Six-point score across the goal line",
        "category": "Sports"
    },
    {
        "id": 44,
        "answer": "Honeybee",
        "acceptable": ["honeybee", "honey bee"],
        "hint": "Striped insect producing golden nectar",
        "category": "Animals"
    },
    {
        "id": 45,
        "answer": "Cornerstone",
        "acceptable": ["cornerstone", "corner stone"],
        "hint": "First stone set in the construction of masonry",
        "category": "Architecture"
    },
    {
        "id": 46,
        "answer": "Love at first sight",
        "acceptable": ["love at first sight"],
        "hint": "Immediate intense attraction upon first meeting",
        "category": "Romance"
    },
    {
        "id": 47,
        "answer": "Catwalk",
        "acceptable": ["catwalk", "cat walk", "runway"],
        "hint": "Narrow platform for runway fashion shows",
        "category": "Fashion"
    },
    {
        "id": 48,
        "answer": "Hiking in the woods",
        "acceptable": ["hiking in the woods", "hike in the woods", "king in the woods", "a king in the woods"],
        "hint": "Walking on trails surrounded by trees",
        "category": "Outdoors"
    },
    {
        "id": 49,
        "answer": "Sandbox",
        "acceptable": ["sandbox", "sand box"],
        "hint": "Enclosure containing sand for children to dig in",
        "category": "Playground"
    },
    {
        "id": 50,
        "answer": "Lovebirds",
        "acceptable": ["lovebirds", "love birds"],
        "hint": "Affectionate pair or small African parrots",
        "category": "Romance"
    },
    {
        "id": 51,
        "answer": "Crossbow",
        "acceptable": ["crossbow", "cross bow"],
        "hint": "Weapon composed of a bow mounted transversely on a stock",
        "category": "Weapons"
    },
    {
        "id": 52,
        "answer": "Eggs over easy",
        "acceptable": ["eggs over easy", "over easy", "egg over easy"],
        "hint": "Fried egg flipped briefly so the yolk stays runny",
        "category": "Breakfast"
    },
    {
        "id": 53,
        "answer": "Multiple choice",
        "acceptable": ["multiple choice", "multiple-choice"],
        "hint": "Exam format with several options to choose from",
        "category": "Education"
    },
    {
        "id": 54,
        "answer": "Come into season",
        "acceptable": ["come into season", "coming into season"],
        "hint": "When fruits or vegetables are ready for harvest",
        "category": "Agriculture"
    },
    {
        "id": 55,
        "answer": "I'll get over it",
        "acceptable": ["i'll get over it", "ill get over it", "i will get over it"],
        "hint": "I'll recover and move past the setback",
        "category": "Idiom"
    },
    {
        "id": 56,
        "answer": "I'm bigger than you",
        "acceptable": ["i'm bigger than you", "im bigger than you", "i am bigger than you"],
        "hint": "Boasting about larger physical size",
        "category": "Expression"
    },
    {
        "id": 57,
        "answer": "Illegal",
        "acceptable": ["illegal", "unlawful", "ill eagle"],
        "hint": "Forbidden by law or rules",
        "category": "Law"
    },
    {
        "id": 58,
        "answer": "Double agent",
        "acceptable": ["double agent", "double-agent", "mole"],
        "hint": "Spy who pretends to act for one government while serving another",
        "category": "Espionage"
    },
    {
        "id": 59,
        "answer": "Rock n roll",
        "acceptable": ["rock n roll", "rock and roll", "rock 'n' roll", "rock & roll"],
        "hint": "Energetic music genre with electric guitars and drums",
        "category": "Music"
    },
    {
        "id": 60,
        "answer": "Good afternoon",
        "acceptable": ["good afternoon"],
        "hint": "Polite greeting spoken after 12 noon",
        "category": "Greeting"
    },
    {
        "id": 61,
        "answer": "Look me in the eye",
        "acceptable": ["look me in the eye", "look me in the eyes"],
        "hint": "Make direct eye contact to show honesty",
        "category": "Idiom"
    },
    {
        "id": 62,
        "answer": "Electric blanket",
        "acceptable": ["electric blanket"],
        "hint": "Bed covering with integrated heating elements",
        "category": "Household"
    },
    {
        "id": 63,
        "answer": "Banknote",
        "acceptable": ["banknote", "bank note", "paper money", "currency note"],
        "hint": "Promissory paper note issued by a central bank",
        "category": "Finance"
    },
    {
        "id": 64,
        "answer": "Bookcase",
        "acceptable": ["bookcase", "book case", "bookshelf"],
        "hint": "Piece of furniture with shelves to hold novels",
        "category": "Furniture"
    },
    {
        "id": 65,
        "answer": "Five kilograms overweight",
        "acceptable": ["five kilograms overweight", "5kg overweight", "5 kilograms overweight", "five kg overweight"],
        "hint": "Carrying 11 extra pounds on the scale",
        "category": "Measurement"
    },
    {
        "id": 66,
        "answer": "Highway",
        "acceptable": ["highway", "high way", "freeway", "expressway"],
        "hint": "Public road for fast vehicle travel between towns",
        "category": "Transportation"
    },
    {
        "id": 67,
        "answer": "Way to go",
        "acceptable": ["way to go", "way-to-go"],
        "hint": "Cheering phrase meaning 'Well done!'",
        "category": "Expression"
    },
    {
        "id": 68,
        "answer": "Sunroof",
        "acceptable": ["sunroof", "sun roof", "moonroof"],
        "hint": "Operable panel in an automobile roof",
        "category": "Automotive"
    },
    {
        "id": 69,
        "answer": "Pardon me",
        "acceptable": ["pardon me", "excuse me"],
        "hint": "Polite formula when interrupting or apologizing",
        "category": "Courtesies"
    },
    {
        "id": 70,
        "answer": "Turnip",
        "acceptable": ["turnip", "turn up", "turn-ip"],
        "hint": "Round white and purple root vegetable",
        "category": "Food"
    },
    {
        "id": 71,
        "answer": "Uproar",
        "acceptable": ["uproar", "up roar", "commotion"],
        "hint": "State of violent agitation, noise, and excitement",
        "category": "Emotion"
    },
    {
        "id": 72,
        "answer": "Thunderstorm",
        "acceptable": ["thunderstorm", "thunder storm"],
        "hint": "Weather event with lightning and thunder",
        "category": "Weather"
    },
    {
        "id": 73,
        "answer": "Microscope",
        "acceptable": ["microscope", "micro scope"],
        "hint": "Optical device used in science labs to view cells",
        "category": "Science"
    },
    {
        "id": 74,
        "answer": "Headquarters",
        "acceptable": ["headquarters", "head quarters", "hq"],
        "hint": "Administrative center of an enterprise",
        "category": "Business"
    },
    {
        "id": 75,
        "answer": "Blanket",
        "acceptable": ["blanket", "blank et"],
        "hint": "Large piece of woolen or woven fabric on a bed",
        "category": "Household"
    },
    {
        "id": 76,
        "answer": "Cut corners",
        "acceptable": ["cut corners", "cutting corners"],
        "hint": "Doing something perfunctorily to save money or effort",
        "category": "Idiom"
    },
    {
        "id": 77,
        "answer": "Cocktail",
        "acceptable": ["cocktail", "cock tail"],
        "hint": "Mixed alcoholic beverage served at happy hour",
        "category": "Beverage"
    },
    {
        "id": 78,
        "answer": "Tennis shoes",
        "acceptable": ["tennis shoes", "sneakers", "running shoes"],
        "hint": "Rubber-soled athletic footwear",
        "category": "Clothing"
    },
    {
        "id": 79,
        "answer": "Summary",
        "acceptable": ["summary", "sum mary", "recap"],
        "hint": "Comprehensive and concise recapitulation",
        "category": "Education"
    },
    {
        "id": 80,
        "answer": "Foul language",
        "acceptable": ["foul language", "fowl language", "profanity"],
        "hint": "Swearing or using objectionable words",
        "category": "Communication"
    },
    {
        "id": 81,
        "answer": "Summer",
        "acceptable": ["summer", "sum r"],
        "hint": "The warmest season between spring and autumn",
        "category": "Seasons"
    },
    {
        "id": 82,
        "answer": "Mutate",
        "acceptable": ["mutate", "mute eight", "mute 8"],
        "hint": "Change in form or genetic structure",
        "category": "Biology"
    },
    {
        "id": 83,
        "answer": "Indian food",
        "acceptable": ["indian food", "in food"],
        "hint": "Spicy dishes like tikka masala, biryani, and naan",
        "category": "Food"
    },
    {
        "id": 84,
        "answer": "The underdog",
        "acceptable": ["the underdog", "underdog", "under dog"],
        "hint": "Competitor thought to have little chance of winning",
        "category": "Sports"
    },
    {
        "id": 85,
        "answer": "Seasoning",
        "acceptable": ["seasoning", "season in g"],
        "hint": "Salt, pepper, or herbs used to improve flavor",
        "category": "Culinary"
    },
    {
        "id": 86,
        "answer": "Easel",
        "acceptable": ["easel", "es l"],
        "hint": "Upright wooden tripod stand for an artist's canvas",
        "category": "Art"
    },
    {
        "id": 87,
        "answer": "Discount",
        "acceptable": ["discount", "dis count"],
        "hint": "Deduction from the regular price",
        "category": "Shopping"
    },
    {
        "id": 88,
        "answer": "Keep your eyes on the ball",
        "acceptable": ["keep your eyes on the ball", "keep your eye on the ball", "eyes on the ball"],
        "hint": "Stay focused and alert to what is happening",
        "category": "Idiom"
    },
    {
        "id": 89,
        "answer": "Fortunate",
        "acceptable": ["fortunate", "four tuna eight"],
        "hint": "Favored by good luck; prosperous",
        "category": "Adjective"
    },
    {
        "id": 90,
        "answer": "Tripod",
        "acceptable": ["tripod", "tri pod"],
        "hint": "Three-legged stand for supporting a camera",
        "category": "Photography"
    },
    {
        "id": 91,
        "answer": "Sweet tooth",
        "acceptable": ["sweet tooth"],
        "hint": "A great liking for candy and confectionery",
        "category": "Idiom"
    },
    {
        "id": 92,
        "answer": "A bone to pick",
        "acceptable": ["a bone to pick", "bone to pick"],
        "hint": "A matter or dispute to discuss and settle",
        "category": "Idiom"
    },
    {
        "id": 93,
        "answer": "Fingers crossed",
        "acceptable": ["fingers crossed", "keep fingers crossed", "finger crossed"],
        "hint": "Gesture expressing hope for good luck",
        "category": "Expression"
    },
    {
        "id": 94,
        "answer": "Sixth sense",
        "acceptable": ["sixth sense", "6th sense"],
        "hint": "Perception beyond the five physical senses (ESP)",
        "category": "Mystery"
    },
    {
        "id": 95,
        "answer": "On second thought",
        "acceptable": ["on second thought", "on second thoughts"],
        "hint": "Changing one's mind after further reflection",
        "category": "Idiom"
    },
    {
        "id": 96,
        "answer": "Sleep on it",
        "acceptable": ["sleep on it"],
        "hint": "Delay making a major decision until the next morning",
        "category": "Idiom"
    }
]

# Enrich each puzzle with image path, letter count pattern (e.g. "6 2" for "Forget it"), etc.
for p in puzzles_meta:
    p["image"] = f"/puzzles/puzzle_{p['id']}.webp"
    # Word pattern: e.g. "Forget it" -> "6, 2 letters"
    words = p["answer"].replace("-", " ").split()
    p["letter_pattern"] = " ".join(["_" * len(w) for w in words])
    p["word_lengths"] = [len(w) for w in words]

os.makedirs("server/data", exist_ok=True)
with open("server/data/puzzles.json", "w", encoding="utf-8") as f:
    json.dump(puzzles_meta, f, indent=2)

print(f"Saved {len(puzzles_meta)} puzzles to server/data/puzzles.json")
