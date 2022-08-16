import json
from flask import Flask, jsonify, request
from flask_cors import CORS
import datetime

app = Flask(__name__)
CORS(app)

chats = [
	{
		'id': 1,
		'contact_id': 1,
		'chats': [

			{
				'id': 1,
				'preview': "This is a test whatsapp message inside the whatsapp clone app",
				'received': True,
				'sent': False,
				'date': "20:05",
				'read': False,
				'starred': False
			},
			{
				'id': 2,
				'preview': "This is a test whatsapp message inside the whatsapp clone app",
				'received': False,
				'sent': True,
				'date': "20:05",
				'read': False,
				'starred': False
			},
			{
				'id': 3,
				'preview': "This is a test whatsapp message inside the whatsapp clone app",
				'received': True,
				'sent': False,
				'date': "20:05",
				'read': False,
				'starred': False
			},
			{
				'id': 4,
				'preview': "This is a test whatsapp message inside the whatsapp clone app",
				'received': False,
				'sent': True,
				'date': "20:05",
				'read': False,
				'starred': False
			},
			{
				'id': 5,
				'preview': "This is a test whatsapp message inside the whatsapp clone app",
				'received': True,
				'sent': False,
				'date': "20:05",
				'read': False,
				'starred': False
			},
			{
				'id': 6,
				'preview': "This is a test whatsapp message inside the whatsapp clone app",
				'received': False,
				'sent': True,
				'date': "20:05",
				'read': False,
				'starred': False
			},
			{
				'id': 7,
				'preview': "This is a test whatsapp message inside the whatsapp clone app",
				'received': True,
				'sent': False,
				'date': "20:05",
				'read': False,
				'starred': False
			},
			{
				'id': 8,
				'preview': "This is a test whatsapp message inside the whatsapp clone app",
				'received': False,
				'sent': True,
				'date': "20:05",
				'read': False,
				'starred': False
			},
			{
				'id': 9,
				'preview': "This is a test whatsapp message inside the whatsapp clone app",
				'received': True,
				'sent': False,
				'date': "20:05",
				'read': False,
				'starred': False
			},
			{
				'id': 10,
				'preview': "This is a test whatsapp message inside the whatsapp clone app",
				'received': False,
				'sent': True,
				'date': "20:05",
				'read': False,
				'starred': False
			},
			{
				'id': 11,
				'preview': "This is a test whatsapp message inside the whatsapp clone app",
				'received': True,
				'sent': False,
				'date': "20:05",
				'read': False,
				'starred': False
			},
			{
				'id': 12,
				'preview': "This is a test whatsapp message inside the whatsapp clone app",
				'received': False,
				'sent': True,
				'date': "20:05",
				'read': False,
				'starred': False
			},
			{
				'id': 13,
				'preview': "This is a test whatsapp message inside the whatsapp clone app",
				'received': True,
				'sent': False,
				'date': "20:05",
				'read': False,
				'starred': False
			},
			{
				'id': 14,
				'preview': "This is a test whatsapp message inside the whatsapp clone app",
				'received': False,
				'sent': True,
				'date': "20:10",
				'read': False,
				'starred': False
			}
		]
	},
	{
		'id': 2,
		'contact_id': 2,
		'chats': [

			{
				'id': 1,
				'preview': "Excited for the Ioniconf 2021! The 23rd can't come quick enough",
				'received': False,
				'sent': True,
				'date': "Yesterday",
				'read': True,
				'starred': False
			}
		]
	},
	{
		'id': 3,
		'contact_id': 3,
		'chats': [

			{
				'id': 1,
				'preview': "Excited for the Ioniconf 2021! The 23rd can't come quick enough",
				'received': False,
				'sent': True,
				'date': "Saturday",
				'read': True,
				'starred': False
			}
		]
	},
	{
		'id': 4,
		'contact_id': 4,
		'chats': [

			{
				'id': 1,
				'preview': "Hey Alan, this is a test whatsapp message",
				'received': True,
				'sent': False,
				'date': "Friday",
				'read': False,
				'starred': False
			}
		]
	},
	{
		'id': 5,
		'contact_id': 5,
		'chats': [

			{
				'id': 1,
				'preview': "Hey Alan, this is a test whatsapp message",
				'received': True,
				'sent': False,
				'date': "Thursday",
				'read': False,
				'starred': False
			}
		]
	},
]

banking_data = [
            {
                "id": 0,
                "name": "Johnny Silverhand",
                "reason": "Yo're a cheap ass",
                "amount": 10000.12345,
                "date": datetime.datetime.now()
            },
            {
                "id": 0,
                "name": "Johnny Silverhand",
                "reason": "Again?",
                "amount": 10000.12345,
                "date": datetime.datetime.now()
            }
        ]

@app.route('/')
def index():
    return "Hello World!"

@app.route('/api/banking', methods=['GET', 'PUT'])
def getBanking():
    if request.method == 'GET':
        return jsonify(banking_data)
    else:
        print(request.data)
        return jsonify(banking_data)


@app.route('/api/login', methods=['POST'])
def login():
    record = json.loads(request.data)

    print(record)
    return jsonify([{
        "initialized": True,
        "loggedIn": True,
        "user": record['user'], 
        "id": "12345",
        "last_login": "Yesterday",
        "token": record['password'],
        "status": "Party hard!",
        "about_me": "Like to party hard.",
        "image": "http://cyberpunk2077-larp.de/images/logos/Samurai_Logo.webp",
      }])

@app.route('/api/profile/<id>')
def profile(id):
    print("Request profile for: " + id)
    return jsonify({
        "initialized": True,
        "loggedIn": True,
        "user": id,
        "id": "12345",
        "last_login": "Yesterday",
        "token": "",
        "status": "Party hard!",
        "about_me": "Like to party hard.",
        "image": "http://cyberpunk2077-larp.de/images/logos/Samurai_Logo.webp",
      })


@app.route('/api/posts')
def posts():
    return jsonify([
        {
            'id': 0,
            'name': "Max Lynch",
            'sponsored': False,
            'time': datetime.datetime.now(),
            'avatar': "https://pbs.twimg.com/profile_images/1318970727173885953/bln98FNj_400x400.jpg",
            'message': "Join a global community of web native developers!",
            'views': "",
            'online': True,
        },
        {
            'id': 1,
            'name': "Ben Sperry",
            'sponsored': True,
            'image': "https://ionicons.com/assets/img/meta/ionicons-og.png",
            'time': datetime.datetime.now(),
            'avatar': "https://pbs.twimg.com/profile_images/1328390491126308864/jHHgl5Dm_400x400.jpg",
            'message': "Check out all the cool IonIcons used on this IonicBook app!",
            'views': "",
            'online': False
        },
        {
            'id': 2,
            'name': "Matt Netkow",
            'sponsored': False,
            'time': datetime.datetime.now(),
            'avatar': "https://pbs.twimg.com/profile_images/1323383930150621187/GKc0nVzi_400x400.jpg",
            'message': "I help web developers build cross-platform Web Native apps.",
            'views': "",
            'online': False
        }
    ])

@app.route('/api/chats')
def get_all_chats():
    return jsonify(chats)

@app.route('/api/chats/<id>')
def get_chat_for_id(id):
    for chat in chats:
        if chat['id'] == int(id):
            return jsonify(chat)

@app.route('/api/chats/mark_read/<id>', methods=['PUT'])
def mark_chat_read(id):
    for chat in chats:
        if chat['id'] == int(id):
            for message in chat['chats']:
                message['read'] = True
            return jsonify(chat)

@app.route('/api/chats/reply/<id>', methods=['POST', 'PUT'])
def add_new_message_to_chat(id):
    for chat in chats:
        if chat['id'] == int(id):
            # print(request.data)
            msg = json.loads(request.data)
            lastid = chat['chats'][-1]['id']
            chat['chats'].append(
				{
					'id': lastid + 1,
					'preview': msg['message'],
					'received': False,
					'sent': False,
					'date': datetime.datetime.now(),
					'read': False,
					'starred': False
				}
			)
            return jsonify(chat)


# Return known contacts to user
@app.route('/api/contacts')
def contacts():
    return jsonify([
        {
            'id': 1,
			'name': "Amy Sister",
			'avatar': "/assets/amy.jpeg"
		},
		{
            'id': 2,
			'name': "Max Lynch",
			'avatar': "/assets/max.jpeg"
		},
        {
            'id': 3,
			'name': "Mike Hartington",
			'avatar': "/assets/mike.jpeg"
		},
        {
            'id': 4,
			'name': "Henk Jurriens",
			'avatar': "/assets/henk.jpeg"
		},
        {
            'id': 5,
			'name': "Simon Grimm",
			'avatar': "/assets/simon.jpeg"
		},
        {
            'id': 6,
			'name': "Josh Morony",
			'avatar': "/assets/josh.jpeg"
		},
        {
            'id': 7,
			'name': "Elon Musk",
			'avatar': "/assets/elon.jpeg"
		},
        {
            'id': 8,
			'name': "Bill Gates",
			'avatar': "/assets/bill.jpeg"
		},
        {
            'id': 9,
			'name': "Mark Zuckerberg",
			'avatar': "/assets/mark.jpeg"
		},
		{
            'id': 10,
			'name': "Ionic Framework (not)",
			'avatar': "/assets/ionic.png"
		}
    ])

@app.route('/api/messages')
def messages():
    return jsonify([{
        'id': 0,
        'name': "Ionic Framework",
        'avatar': "http://cyberpunk2077-larp.de/images/logos/Samurai_Logo.webp",
        'message': "This is a test message. This is a test message. This is a test message. ",
        'last_message_sent': 3,
        'new_message_count': 2
    },
    {
        'id': 1,
        'name': "Capacitor JS",
        'avatar': "http://cyberpunk2077-larp.de/images/logos/Maelstrom_Logo.webp",
        'message': "",
        'last_message_sent': 9,
        'new_message_count': 0
    },
    {
        'id': 2,
        'name': "Max Lynch",
        'avatar': "http://cyberpunk2077-larp.de/images/logos/Tyger_Claw_Logo.webp",
        'message': "",
        'last_message_sent': 15,
        'new_message_count': 0
    },
    {
        'id': 3,
        'name': "Ben Sperry",
        'avatar': "http://cyberpunk2077-larp.de/images/logos/Voodoo_Boys_Logo.webp",
        'message': "",
        'last_message_sent': 27,
        'new_message_count': 0
    },
    {
        'id': 4,
        'name': "Matt Netkow",
        'avatar': "https://pbs.twimg.com/profile_images/1323383930150621187/GKc0nVzi_400x400.jpg",
        'message': "",
        'last_message_sent': 31,
        'new_message_count': 1
    },
    {
        'id': 5,
        'name': "Liam DeBeasi",
        'avatar': "https://pbs.twimg.com/profile_images/1105953692669366273/ZNK4lRAJ_400x400.jpg",
        'message': "",
        'last_message_sent': 41,
        'new_message_count': 0
    },
    {
        'id': 6,
        'name': "Mike Hartington",
        'avatar': "https://pbs.twimg.com/profile_images/1084993841898446849/DJ8XtR6L_400x400.jpg",
        'message': "",
        'last_message_sent': 47,
        'new_message_count': 0
    },
    {
        'id': 7,
        'name': "Adam Bradley",
        'avatar': "https://pbs.twimg.com/profile_images/909075942320025600/hfYqicUk_400x400.jpg",
        'message': "",
        'last_message_sent': 51,
        'new_message_count': 0
    },
    {
        'id': 8,
        'name': "Brody Kidd",
        'avatar': "https://pbs.twimg.com/profile_images/477539679567228928/JObyaUW__400x400.jpeg",
        'message': "",
        'last_message_sent': 53,
        'new_message_count': 0
    }
    ])

app.run(port=3000, debug=True)