import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';

interface UserSocket {
  userId: string;
  role: string;
  socketId: string;
}

const connectedUsers = new Map<string, UserSocket>();

export const setupSocket = (io: Server) => {
  // Middleware para autenticación de WebSocket
  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      
      if (!token) {
        return next(new Error('No token provided'));
      }
      
      const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      
      socket.data.user = {
        userId: decoded.userId,
        email: decoded.email,
        role: decoded.role,
        name: decoded.name,
      };
      
      next();
    } catch (error) {
      next(new Error('Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    const user = socket.data.user;
    console.log(`User connected: ${user.name} (${user.role})`);
    
    // Registrar usuario conectado
    connectedUsers.set(socket.id, {
      userId: user.userId,
      role: user.role,
      socketId: socket.id,
    });
    
    // Unirse a salas según el rol
    socket.join(`user:${user.userId}`);
    socket.join(`role:${user.role}`);
    
    // Notificar a otros usuarios sobre la conexión
    socket.broadcast.emit('user:connected', {
      userId: user.userId,
      name: user.name,
      role: user.role,
    });
    
    // Manejar unión a salas de propiedades
    socket.on('join:property', (propertyId: string) => {
      socket.join(`property:${propertyId}`);
      console.log(`User ${user.name} joined property ${propertyId}`);
    });
    
    // Manejar salida de salas de propiedades
    socket.on('leave:property', (propertyId: string) => {
      socket.leave(`property:${propertyId}`);
      console.log(`User ${user.name} left property ${propertyId}`);
    });
    
    // Manejar unión a salas de tickets
    socket.on('join:ticket', (ticketId: string) => {
      socket.join(`ticket:${ticketId}`);
      console.log(`User ${user.name} joined ticket ${ticketId}`);
    });
    
    // Manejar salida de salas de tickets
    socket.on('leave:ticket', (ticketId: string) => {
      socket.leave(`ticket:${ticketId}`);
      console.log(`User ${user.name} left ticket ${ticketId}`);
    });
    
    // Enviar mensaje directo a un usuario
    socket.on('send:dm', (data: { toUserId: string; message: string; type: string }) => {
      const targetSocket = Array.from(connectedUsers.values()).find(
        u => u.userId === data.toUserId
      );
      
      if (targetSocket) {
        io.to(targetSocket.socketId).emit('dm:received', {
          fromUserId: user.userId,
          fromUserName: user.name,
          message: data.message,
          type: data.type,
          timestamp: new Date().toISOString(),
        });
      }
    });
    
    // Notificaciones de propiedades
    socket.on('property:updated', (data: { propertyId: string; updates: any }) => {
      // Notificar a todos los usuarios interesados en la propiedad
      io.to(`property:${data.propertyId}`).emit('property:notification', {
        type: 'property_updated',
        propertyId: data.propertyId,
        message: `La propiedad ha sido actualizada`,
        data: data.updates,
        timestamp: new Date().toISOString(),
      });
    });
    
    // Notificaciones de tickets
    socket.on('ticket:updated', (data: { ticketId: string; updates: any }) => {
      // Notificar a todos los usuarios interesados en el ticket
      io.to(`ticket:${data.ticketId}`).emit('ticket:notification', {
        type: 'ticket_updated',
        ticketId: data.ticketId,
        message: `El ticket ha sido actualizado`,
        data: data.updates,
        timestamp: new Date().toISOString(),
      });
    });
    
    // Notificaciones de visitas
    socket.on('visit:scheduled', (data: { propertyId: string; visitData: any }) => {
      // Notificar al propietario y corredor de la propiedad
      io.to(`property:${data.propertyId}`).emit('visit:notification', {
        type: 'visit_scheduled',
        propertyId: data.propertyId,
        message: `Nueva visita programada`,
        data: data.visitData,
        timestamp: new Date().toISOString(),
      });
    });
    
    // Manejar desconexión
    socket.on('disconnect', () => {
      console.log(`User disconnected: ${user.name} (${user.role})`);
      
      // Eliminar usuario de los conectados
      connectedUsers.delete(socket.id);
      
      // Notificar a otros usuarios sobre la desconexión
      socket.broadcast.emit('user:disconnected', {
        userId: user.userId,
        name: user.name,
        role: user.role,
      });
    });
    
    // Enviar mensaje de bienvenida
    socket.emit('connection:established', {
      message: 'Conexión establecida exitosamente',
      userId: user.userId,
      role: user.role,
      timestamp: new Date().toISOString(),
    });
  });
};

// Funciones helper para enviar notificaciones desde el servidor
export const sendNotification = (io: Server, data: {
  type: string;
  to?: string; // userId o role
  message: string;
  data?: any;
}) => {
  if (data.to) {
    if (data.to.startsWith('role:')) {
      // Enviar a todos los usuarios de un rol
      io.to(data.to).emit('notification', {
        type: data.type,
        message: data.message,
        data: data.data,
        timestamp: new Date().toISOString(),
      });
    } else {
      // Enviar a un usuario específico
      io.to(`user:${data.to}`).emit('notification', {
        type: data.type,
        message: data.message,
        data: data.data,
        timestamp: new Date().toISOString(),
      });
    }
  } else {
    // Enviar a todos los usuarios conectados
    io.emit('notification', {
      type: data.type,
      message: data.message,
      data: data.data,
      timestamp: new Date().toISOString(),
    });
  }
};

export const sendPropertyNotification = (io: Server, propertyId: string, data: {
  type: string;
  message: string;
  data?: any;
}) => {
  io.to(`property:${propertyId}`).emit('property:notification', {
    type: data.type,
    propertyId,
    message: data.message,
    data: data.data,
    timestamp: new Date().toISOString(),
  });
};

export const sendTicketNotification = (io: Server, ticketId: string, data: {
  type: string;
  message: string;
  data?: any;
}) => {
  io.to(`ticket:${ticketId}`).emit('ticket:notification', {
    type: data.type,
    ticketId,
    message: data.message,
    data: data.data,
    timestamp: new Date().toISOString(),
  });
};