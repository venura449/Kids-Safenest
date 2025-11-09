import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Kids Safe Nest API',
      version: '1.0.0',
      description: 'API documentation for Kids Safe Nest application',
      contact: {
        name: 'API Support',
        email: 'support@kidssafenest.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:14192',
        description: 'Development server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'User ID'
            },
            name: {
              type: 'string',
              description: 'User full name'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'User email address'
            },
            created_at: {
              type: 'string',
              format: 'date-time',
              description: 'User creation timestamp'
            }
          }
        },
        Vital: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            type: { type: 'string' },
            value: { type: 'string' },
            unit: { type: 'string' },
            status: { type: 'string', example: 'normal' },
            date: { type: 'string', format: 'date' }
          }
        },
        HealthSymptom: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            symptom: { type: 'string' },
            severity: { type: 'string', enum: ['mild', 'moderate', 'severe'] },
            notes: { type: 'string' },
            date: { type: 'string', format: 'date' }
          }
        },
        Medication: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            name: { type: 'string' },
            dosage: { type: 'string' },
            frequency: { type: 'string' },
            time: { type: 'string' },
            taken: { type: 'boolean' },
            date: { type: 'string', format: 'date' }
          }
        },
        HealthGoal: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            goal: { type: 'string' },
            target: { type: 'integer' },
            unit: { type: 'string' },
            progress: { type: 'integer' },
            completed: { type: 'boolean' }
          }
        },
        HealthOverview: {
          type: 'object',
          properties: {
            vitals: { type: 'array', items: { $ref: '#/components/schemas/Vital' } },
            symptoms: { type: 'array', items: { $ref: '#/components/schemas/HealthSymptom' } },
            medications: { type: 'array', items: { $ref: '#/components/schemas/Medication' } },
            goals: { type: 'array', items: { $ref: '#/components/schemas/HealthGoal' } }
          }
        },
        MenstruationProfile: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            userId: { type: 'integer' },
            cycleLength: { type: 'integer', example: 28 },
            lastPeriod: { type: 'string', format: 'date' }
          }
        },
        MenstruationSymptom: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            symptom: { type: 'string' },
            severity: { type: 'string', enum: ['mild', 'moderate', 'severe'] },
            notes: { type: 'string' },
            date: { type: 'string', format: 'date' },
            phase: { type: 'string', enum: ['menstrual', 'follicular', 'ovulation', 'luteal'] }
          }
        },
        MenstruationMood: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            mood: { type: 'string', example: 'happy' },
            energy: { type: 'integer', example: 5 },
            notes: { type: 'string' },
            date: { type: 'string', format: 'date' }
          }
        },
        MenstruationOverview: {
          type: 'object',
          properties: {
            profile: { $ref: '#/components/schemas/MenstruationProfile' },
            symptoms: { type: 'array', items: { $ref: '#/components/schemas/MenstruationSymptom' } },
            moods: { type: 'array', items: { $ref: '#/components/schemas/MenstruationMood' } }
          }
        },
        SensorReading: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            watch_id: { type: 'string', example: 'W001' },
            temp: { type: 'number', format: 'float', example: 36.5 },
            humidity: { type: 'number', format: 'float', example: 55.2 },
            pressure: { type: 'number', format: 'float', example: 1013.25 },
            latitude: { type: 'number', format: 'float', example: 6.9271 },
            longitude: { type: 'number', format: 'float', example: 79.861198 },
            battery: { type: 'number', format: 'float', example: 87.5 },
            spo2: { type: 'integer', example: 98 },
            bpm: { type: 'integer', example: 72 },
            received_at: { type: 'string', format: 'date-time' }
          }
        },
        RegisterRequest: {
          type: 'object',
          required: ['name', 'email', 'password'],
          properties: {
            name: {
              type: 'string',
              description: 'User full name',
              example: 'John Doe'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'User email address',
              example: 'john@example.com'
            },
            password: {
              type: 'string',
              description: 'User password (min 6 characters)',
              example: 'password123'
            }
          }
        },
        LoginRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              description: 'User email address',
              example: 'john@example.com'
            },
            password: {
              type: 'string',
              description: 'User password',
              example: 'password123'
            }
          }
        },
        ForgotPasswordRequest: {
          type: 'object',
          required: ['email'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              description: 'User email address',
              example: 'john@example.com'
            }
          }
        },
        ResetPasswordRequest: {
          type: 'object',
          required: ['token', 'password'],
          properties: {
            token: {
              type: 'string',
              description: 'Reset password token',
              example: 'reset_token_here'
            },
            password: {
              type: 'string',
              description: 'New password (min 6 characters)',
              example: 'newpassword123'
            }
          }
        },
        AuthResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              description: 'Operation success status'
            },
            message: {
              type: 'string',
              description: 'Response message'
            },
            token: {
              type: 'string',
              description: 'JWT token for authentication'
            },
            user: {
              $ref: '#/components/schemas/User'
            }
          }
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false
            },
            message: {
              type: 'string',
              description: 'Error message'
            }
          }
        }
      }
    }
  },
  apis: ['./routes/*.js', './controllers/*.js']
};

export const specs = swaggerJsdoc(options);

