const { v4: uuidv4 } = require('uuid');

const squadSessions = {}; // In-memory store: { roomId: { members: [], cart: [] } }

module.exports = (io) => {
    io.on('connection', (socket) => {
        console.log(`User Connected: ${socket.id}`);
        // 1. Create Squad Session
        socket.on('create_squad', ({ hostName, hostAvatar }) => {
            const roomId = uuidv4().slice(0, 6).toUpperCase(); // Short code
            squadSessions[roomId] = {
                members: [{ id: socket.id, name: hostName, avatar: hostAvatar, isHost: true }],
                cart: []
            };
            socket.join(roomId);
            socket.emit('squad_created', { roomId, members: squadSessions[roomId].members });
            console.log(`Squad Created: ${roomId} by ${hostName}`);
        });
        // 2. Join Squad Session
        socket.on('join_squad', ({ roomId, userName, userAvatar }) => {
            const room = squadSessions[roomId];
            if (room) {
                const newMember = { id: socket.id, name: userName, avatar: userAvatar, isHost: false };
                room.members.push(newMember);
                socket.join(roomId);
                // Notify everyone in room (including sender to update state)
                io.to(roomId).emit('squad_updated', {
                    members: room.members,
                    cart: room.cart
                });
                console.log(`${userName} joined squad ${roomId}`);
            } else {
                socket.emit('error', { message: 'Squad not found' });
            }
        });
        // 3. Update Shared Cart (Add/Remove Item)
        socket.on('update_cart', ({ roomId, cartItems, action, user }) => {
            const room = squadSessions[roomId];
            if (room) {
                room.cart = cartItems; // Sync source of truth
                // Broadcast to everyone ELSE in the room (or everyone)
                socket.to(roomId).emit('cart_synced', { cart: room.cart, action, user });
            }
        });
        // 4. Send Reaction/Emoji
        socket.on('send_reaction', ({ roomId, reaction, user }) => {
            io.to(roomId).emit('receive_reaction', { reaction, user });
        });
        // 5. Delivery Partner Logic
        socket.on('join_delivery', () => {
            socket.join('delivery-room');
            console.log(`Socket ${socket.id} joined delivery-room`);
        });
        // 6. User Personal Room (for Order Updates)
        socket.on('join_user_room', (userId) => {
            if (userId) {
                socket.join(`user-${userId}`);
                console.log(`Socket ${socket.id} joined user room: user-${userId}`);
            }
        });
        // 7. Order Specific Room (For tracking)
        socket.on('join_order_room', (orderId) => {
            socket.join(`order-${orderId}`);
            console.log(`Socket ${socket.id} joined order room: order-${orderId}`);
        });
        // 8. Restaurant Partner Room
        socket.on('join_partner_room', (partnerId) => {
            socket.join(`partner-${partnerId}`);
            console.log(`Socket ${socket.id} joined partner room: partner-${partnerId}`);
        });
        // 9. Live Location Update
        socket.on('update-location', ({ orderId, location }) => {
            // Broadcast to the specific order room so User and Restaurant can see it
            // Payload: { lat: number, lng: number, heading: number }
            socket.to(`order-${orderId}`).emit('driver-location-updated', location);
        });
        // Disconnect
        socket.on('disconnect', () => {
            console.log('User Disconnected', socket.id);
            // Cleanup logic (optional: remove user from sessions)
            for (const [roomId, session] of Object.entries(squadSessions)) {
                const index = session.members.findIndex(m => m.id === socket.id);
                if (index !== -1) {
                    session.members.splice(index, 1);
                    io.to(roomId).emit('squad_updated', { members: session.members, cart: session.cart });
                    if (session.members.length === 0) {
                        delete squadSessions[roomId]; // Delete empty room
                    }
                    break;
                }
            }
        });
    });
};