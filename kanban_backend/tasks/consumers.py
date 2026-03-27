import json
from channels.generic.websocket import AsyncWebsocketConsumer


class TaskConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.board_id = self.scope["url_route"]["kwargs"]["boardId"]
        self.group_name = f"board_{self.board_id}"

        await self.channel_layer.group_add(
            self.group_name,
            self.channel_name
        )

        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        data = json.loads(text_data)

        if data["type"] == "task_moved":
            # ✅ Update DB here

            await self.channel_layer.group_send(
                self.group_name,
                {
                    "type": "task_moved_event",
                    "data": data
                }
            )

    async def task_moved_event(self, event):
        await self.send(text_data=json.dumps(event["data"]))