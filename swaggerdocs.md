{
  "swagger": "2.0",
  "info": {
    "title": "edlas API",
    "description": "API documentation for edlas School Management System",
    "termsOfService": "https://www.policy.edlas.com",
    "contact": {
      "email": "contact@edlas.com"
    },
    "version": "v1"
  },
  "host": "edlas.lolskins.gg",
  "schemes": [
    "https"
  ],
  "basePath": "/api",
  "consumes": [
    "application/json"
  ],
  "produces": [
    "application/json"
  ],
  "securityDefinitions": {
    "Basic": {
      "type": "basic"
    }
  },
  "security": [
    {
      "Basic": []
    }
  ],
  "paths": {
    "/academics/class-sections/": {
      "get": {
        "operationId": "academics_class-sections_list",
        "description": "",
        "parameters": [
          {
            "name": "search",
            "in": "query",
            "description": "A search term.",
            "required": false,
            "type": "string"
          },
          {
            "name": "ordering",
            "in": "query",
            "description": "Which field to use when ordering the results.",
            "required": false,
            "type": "string"
          },
          {
            "name": "page",
            "in": "query",
            "description": "A page number within the paginated result set.",
            "required": false,
            "type": "integer"
          },
          {
            "name": "page_size",
            "in": "query",
            "description": "Number of results to return per page.",
            "required": false,
            "type": "integer"
          }
        ],
        "responses": {
          "200": {
            "description": "",
            "schema": {
              "required": [
                "count",
                "results"
              ],
              "type": "object",
              "properties": {
                "count": {
                  "type": "integer"
                },
                "next": {
                  "type": "string",
                  "format": "uri",
                  "x-nullable": true
                },
                "previous": {
                  "type": "string",
                  "format": "uri",
                  "x-nullable": true
                },
                "results": {
                  "type": "array",
                  "items": {
                    "$ref": "#/definitions/ClassSection"
                  }
                }
              }
            }
          }
        },
        "tags": [
          "academics"
        ]
      },
      "post": {
        "operationId": "academics_class-sections_create",
        "description": "",
        "parameters": [
          {
            "name": "data",
            "in": "body",
            "required": true,
            "schema": {
              "$ref": "#/definitions/ClassSectionCreateUpdate"
            }
          }
        ],
        "responses": {
          "201": {
            "description": "",
            "schema": {
              "$ref": "#/definitions/ClassSectionCreateUpdate"
            }
          }
        },
        "tags": [
          "academics"
        ]
      },
      "parameters": []
    },
    "/academics/class-sections/{id}/": {
      "get": {
        "operationId": "academics_class-sections_read",
        "description": "",
        "parameters": [],
        "responses": {
          "200": {
            "description": "",
            "schema": {
              "$ref": "#/definitions/ClassSection"
            }
          }
        },
        "tags": [
          "academics"
        ]
      },
      "put": {
        "operationId": "academics_class-sections_update",
        "description": "",
        "parameters": [
          {
            "name": "data",
            "in": "body",
            "required": true,
            "schema": {
              "$ref": "#/definitions/ClassSectionCreateUpdate"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "",
            "schema": {
              "$ref": "#/definitions/ClassSectionCreateUpdate"
            }
          }
        },
        "tags": [
          "academics"
        ]
      },
      "patch": {
        "operationId": "academics_class-sections_partial_update",
        "description": "",
        "parameters": [
          {
            "name": "data",
            "in": "body",
            "required": true,
            "schema": {
              "$ref": "#/definitions/ClassSectionCreateUpdate"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "",
            "schema": {
              "$ref": "#/definitions/ClassSectionCreateUpdate"
            }
          }
        },
        "tags": [
          "academics"
        ]
      },
      "delete": {
        "operationId": "academics_class-sections_delete",
        "description": "",
        "parameters": [],
        "responses": {
          "204": {
            "description": ""
          }
        },
        "tags": [
          "academics"
        ]
      },
      "parameters": [
        {
          "name": "id",
          "in": "path",
          "description": "A unique integer value identifying this Class Section.",
          "required": true,
          "type": "integer"
        }
      ]
    },
    "/academics/class-sections/{id}/teacher/": {
      "patch": {
        "operationId": "academics_class-sections_assign_teacher",
        "description": "Assign or reassign a teacher to a class section",
        "parameters": [
          {
            "name": "data",
            "in": "body",
            "required": true,
            "schema": {
              "required": [
                "teacher_id"
              ],
              "type": "object",
              "properties": {
                "teacher_id": {
                  "description": "ID of the teacher to assign",
                  "type": "integer"
                }
              }
            }
          }
        ],
        "responses": {
          "200": {
            "description": "",
            "schema": {
              "required": [
                "teacher_id"
              ],
              "type": "object",
              "properties": {
                "teacher_id": {
                  "description": "ID of the teacher to assign",
                  "type": "integer"
                }
              }
            }
          }
        },
        "tags": [
          "academics"
        ]
      },
      "parameters": [
        {
          "name": "id",
          "in": "path",
          "description": "A unique integer value identifying this Class Section.",
          "required": true,
          "type": "integer"
        }
      ]
    },
    "/academics/class-subjects/": {
      "get": {
        "operationId": "academics_class-subjects_list",
        "description": "List all class subjects grouped by class",
        "parameters": [
          {
            "name": "classroom__name",
            "in": "query",
            "description": "",
            "required": false,
            "type": "string"
          },
          {
            "name": "is_optional",
            "in": "query",
            "description": "",
            "required": false,
            "type": "string"
          },
          {
            "name": "search",
            "in": "query",
            "description": "A search term.",
            "required": false,
            "type": "string"
          },
          {
            "name": "ordering",
            "in": "query",
            "description": "Which field to use when ordering the results.",
            "required": false,
            "type": "string"
          },
          {
            "name": "page",
            "in": "query",
            "description": "A page number within the paginated result set.",
            "required": false,
            "type": "integer"
          },
          {
            "name": "page_size",
            "in": "query",
            "description": "Number of results to return per page.",
            "required": false,
            "type": "integer"
          }
        ],
        "responses": {
          "200": {
            "description": "",
            "schema": {
              "required": [
                "count",
                "results"
              ],
              "type": "object",
              "properties": {
                "count": {
                  "type": "integer"
                },
                "next": {
                  "type": "string",
                  "format": "uri",
                  "x-nullable": true
                },
                "previous": {
                  "type": "string",
                  "format": "uri",
                  "x-nullable": true
                },
                "results": {
                  "type": "array",
                  "items": {
                    "$ref": "#/definitions/ClassSubjectList"
                  }
                }
              }
            }
          }
        },
        "tags": [
          "academics"
        ]
      },
      "post": {
        "operationId": "academics_class-subjects_create",
        "description": "Assign subject to class",
        "parameters": [
          {
            "name": "data",
            "in": "body",
            "required": true,
            "schema": {
              "$ref": "#/definitions/ClassSubjectCreateUpdate"
            }
          }
        ],
        "responses": {
          "201": {
            "description": "",
            "schema": {
              "$ref": "#/definitions/ClassSubjectCreateUpdate"
            }
          }
        },
        "tags": [
          "academics"
        ]
      },
      "parameters": []
    },
    "/academics/class-subjects/by_class/{class_name}/": {
      "get": {
        "operationId": "academics_class-subjects_by_class",
        "description": "Get all subjects for a specific class",
        "parameters": [
          {
            "name": "classroom__name",
            "in": "query",
            "description": "",
            "required": false,
            "type": "string"
          },
          {
            "name": "is_optional",
            "in": "query",
            "description": "",
            "required": false,
            "type": "string"
          },
          {
            "name": "search",
            "in": "query",
            "description": "A search term.",
            "required": false,
            "type": "string"
          },
          {
            "name": "ordering",
            "in": "query",
            "description": "Which field to use when ordering the results.",
            "required": false,
            "type": "string"
          },
          {
            "name": "page",
            "in": "query",
            "description": "A page number within the paginated result set.",
            "required": false,
            "type": "integer"
          },
          {
            "name": "page_size",
            "in": "query",
            "description": "Number of results to return per page.",
            "required": false,
            "type": "integer"
          }
        ],
        "responses": {
          "200": {
            "description": "",
            "schema": {
              "required": [
                "count",
                "results"
              ],
              "type": "object",
              "properties": {
                "count": {
                  "type": "integer"
                },
                "next": {
                  "type": "string",
                  "format": "uri",
                  "x-nullable": true
                },
                "previous": {
                  "type": "string",
                  "format": "uri",
                  "x-nullable": true
                },
                "results": {
                  "type": "array",
                  "items": {
                    "$ref": "#/definitions/ClassSubjectList"
                  }
                }
              }
            }
          }
        },
        "tags": [
          "academics"
        ]
      },
      "parameters": [
        {
          "name": "class_name",
          "in": "path",
          "required": true,
          "type": "string"
        }
      ]
    },
    "/academics/class-subjects/teacher_assignments/": {
      "get": {
        "operationId": "academics_class-subjects_teacher_assignments",
        "description": "Get all teacher assignments",
        "parameters": [
          {
            "name": "classroom__name",
            "in": "query",
            "description": "",
            "required": false,
            "type": "string"
          },
          {
            "name": "is_optional",
            "in": "query",
            "description": "",
            "required": false,
            "type": "string"
          },
          {
            "name": "search",
            "in": "query",
            "description": "A search term.",
            "required": false,
            "type": "string"
          },
          {
            "name": "ordering",
            "in": "query",
            "description": "Which field to use when ordering the results.",
            "required": false,
            "type": "string"
          },
          {
            "name": "page",
            "in": "query",
            "description": "A page number within the paginated result set.",
            "required": false,
            "type": "integer"
          },
          {
            "name": "page_size",
            "in": "query",
            "description": "Number of results to return per page.",
            "required": false,
            "type": "integer"
          }
        ],
        "responses": {
          "200": {
            "description": "",
            "schema": {
              "required": [
                "count",
                "results"
              ],
              "type": "object",
              "properties": {
                "count": {
                  "type": "integer"
                },
                "next": {
                  "type": "string",
                  "format": "uri",
                  "x-nullable": true
                },
                "previous": {
                  "type": "string",
                  "format": "uri",
                  "x-nullable": true
                },
                "results": {
                  "type": "array",
                  "items": {
                    "$ref": "#/definitions/ClassSubjectList"
                  }
                }
              }
            }
          }
        },
        "tags": [
          "academics"
        ]
      },
      "parameters": []
    },
    "/academics/class-subjects/{id}/": {
      "get": {
        "operationId": "academics_class-subjects_read",
        "description": "ViewSet for Class Subjects (Subject assignments to classes)",
        "parameters": [],
        "responses": {
          "200": {
            "description": "",
            "schema": {
              "$ref": "#/definitions/ClassSubjectList"
            }
          }
        },
        "tags": [
          "academics"
        ]
      },
      "put": {
        "operationId": "academics_class-subjects_update",
        "description": "Update class subject",
        "parameters": [
          {
            "name": "data",
            "in": "body",
            "required": true,
            "schema": {
              "$ref": "#/definitions/ClassSubjectCreateUpdate"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "",
            "schema": {
              "$ref": "#/definitions/ClassSubjectCreateUpdate"
            }
          }
        },
        "tags": [
          "academics"
        ]
      },
      "patch": {
        "operationId": "academics_class-subjects_partial_update",
        "description": "ViewSet for Class Subjects (Subject assignments to classes)",
        "parameters": [
          {
            "name": "data",
            "in": "body",
            "required": true,
            "schema": {
              "$ref": "#/definitions/ClassSubjectCreateUpdate"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "",
            "schema": {
              "$ref": "#/definitions/ClassSubjectCreateUpdate"
            }
          }
        },
        "tags": [
          "academics"
        ]
      },
      "delete": {
        "operationId": "academics_class-subjects_delete",
        "description": "Remove subject from class",
        "parameters": [],
        "responses": {
          "204": {
            "description": ""
          }
        },
        "tags": [
          "academics"
        ]
      },
      "parameters": [
        {
          "name": "id",
          "in": "path",
          "description": "A unique integer value identifying this Subject.",
          "required": true,
          "type": "integer"
        }
      ]
    },
    "/academics/class-subjects/{id}/assign_teacher/": {
      "post": {
        "operationId": "academics_class-subjects_assign_teacher",
        "description": "Assign teacher to teach this subject in a specific section",
        "parameters": [
          {
            "name": "data",
            "in": "body",
            "required": true,
            "schema": {
              "$ref": "#/definitions/ClassSubjectList"
            }
          }
        ],
        "responses": {
          "201": {
            "description": "",
            "schema": {
              "$ref": "#/definitions/ClassSubjectList"
            }
          }
        },
        "tags": [
          "academics"
        ]
      },
      "parameters": [
        {
          "name": "id",
          "in": "path",
          "description": "A unique integer value identifying this Subject.",
          "required": true,
          "type": "integer"
        }
      ]
    },
    "/academics/classrooms/": {
      "get": {
        "operationId": "academics_classrooms_list",
        "description": "",
        "parameters": [
          {
            "name": "search",
            "in": "query",
            "description": "A search term.",
            "required": false,
            "type": "string"
          },
          {
            "name": "ordering",
            "in": "query",
            "description": "Which field to use when ordering the results.",
            "required": false,
            "type": "string"
          },
          {
            "name": "page",
            "in": "query",
            "description": "A page number within the paginated result set.",
            "required": false,
            "type": "integer"
          },
          {
            "name": "page_size",
            "in": "query",
            "description": "Number of results to return per page.",
            "required": false,
            "type": "integer"
          }
        ],
        "responses": {
          "200": {
            "description": "",
            "schema": {
              "required": [
                "count",
                "results"
              ],
              "type": "object",
              "properties": {
                "count": {
                  "type": "integer"
                },
                "next": {
                  "type": "string",
                  "format": "uri",
                  "x-nullable": true
                },
                "previous": {
                  "type": "string",
                  "format": "uri",
                  "x-nullable": true
                },
                "results": {
                  "type": "array",
                  "items": {
                    "$ref": "#/definitions/Classroom"
                  }
                }
              }
            }
          }
        },
        "tags": [
          "academics"
        ]
      },
      "post": {
        "operationId": "academics_classrooms_create",
        "description": "",
        "parameters": [
          {
            "name": "data",
            "in": "body",
            "required": true,
            "schema": {
              "$ref": "#/definitions/Classroom"
            }
          }
        ],
        "responses": {
          "201": {
            "description": "",
            "schema": {
              "$ref": "#/definitions/Classroom"
            }
          }
        },
        "tags": [
          "academics"
        ]
      },
      "parameters": []
    },
    "/academics/classrooms/create_with_sections/": {
      "post": {
        "operationId": "academics_classrooms_create_with_sections",
        "description": "Create a classroom along with its sections in one request.",
        "parameters": [
          {
            "name": "data",
            "in": "body",
            "required": true,
            "schema": {
              "$ref": "#/definitions/ClassroomSections"
            }
          }
        ],
        "responses": {
          "201": {
            "description": "",
            "schema": {
              "$ref": "#/definitions/ClassroomSections"
            }
          }
        },
        "tags": [
          "academics"
        ]
      },
      "parameters": []
    },
    "/academics/classrooms/{id}/": {
      "get": {
        "operationId": "academics_classrooms_read",
        "description": "",
        "parameters": [],
        "responses": {
          "200": {
            "description": "",
            "schema": {
              "$ref": "#/definitions/Classroom"
            }
          }
        },
        "tags": [
          "academics"
        ]
      },
      "put": {
        "operationId": "academics_classrooms_update",
        "description": "",
        "parameters": [
          {
            "name": "data",
            "in": "body",
            "required": true,
            "schema": {
              "$ref": "#/definitions/Classroom"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "",
            "schema": {
              "$ref": "#/definitions/Classroom"
            }
          }
        },
        "tags": [
          "academics"
        ]
      },
      "patch": {
        "operationId": "academics_classrooms_partial_update",
        "description": "",
        "parameters": [
          {
            "name": "data",
            "in": "body",
            "required": true,
            "schema": {
              "$ref": "#/definitions/Classroom"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "",
            "schema": {
              "$ref": "#/definitions/Classroom"
            }
          }
        },
        "tags": [
          "academics"
        ]
      },
      "delete": {
        "operationId": "academics_classrooms_delete",
        "description": "",
        "parameters": [],
        "responses": {
          "204": {
            "description": ""
          }
        },
        "tags": [
          "academics"
        ]
      },
      "parameters": [
        {
          "name": "id",
          "in": "path",
          "description": "A unique integer value identifying this Classroom.",
          "required": true,
          "type": "integer"
        }
      ]
    },
    "/academics/subjects/": {
      "get": {
        "operationId": "academics_subjects_list",
        "description": "List all subjects",
        "parameters": [
          {
            "name": "search",
            "in": "query",
            "description": "A search term.",
            "required": false,
            "type": "string"
          },
          {
            "name": "ordering",
            "in": "query",
            "description": "Which field to use when ordering the results.",
            "required": false,
            "type": "string"
          },
          {
            "name": "page",
            "in": "query",
            "description": "A page number within the paginated result set.",
            "required": false,
            "type": "integer"
          },
          {
            "name": "page_size",
            "in": "query",
            "description": "Number of results to return per page.",
            "required": false,
            "type": "integer"
          }
        ],
        "responses": {
          "200": {
            "description": "",
            "schema": {
              "required": [
                "count",
                "results"
              ],
              "type": "object",
              "properties": {
                "count": {
                  "type": "integer"
                },
                "next": {
                  "type": "string",
                  "format": "uri",
                  "x-nullable": true
                },
                "previous": {
                  "type": "string",
                  "format": "uri",
                  "x-nullable": true
                },
                "results": {
                  "type": "array",
                  "items": {
                    "$ref": "#/definitions/SubjectMaster"
                  }
                }
              }
            }
          }
        },
        "tags": [
          "academics"
        ]
      },
      "post": {
        "operationId": "academics_subjects_create",
        "description": "Create new subject",
        "parameters": [
          {
            "name": "data",
            "in": "body",
            "required": true,
            "schema": {
              "$ref": "#/definitions/SubjectMaster"
            }
          }
        ],
        "responses": {
          "201": {
            "description": "",
            "schema": {
              "$ref": "#/definitions/SubjectMaster"
            }
          }
        },
        "tags": [
          "academics"
        ]
      },
      "parameters": []
    },
    "/academics/subjects/{id}/": {
      "get": {
        "operationId": "academics_subjects_read",
        "description": "ViewSet for Subject Master (Subject Catalog)",
        "parameters": [],
        "responses": {
          "200": {
            "description": "",
            "schema": {
              "$ref": "#/definitions/SubjectMaster"
            }
          }
        },
        "tags": [
          "academics"
        ]
      },
      "put": {
        "operationId": "academics_subjects_update",
        "description": "Update subject",
        "parameters": [
          {
            "name": "data",
            "in": "body",
            "required": true,
            "schema": {
              "$ref": "#/definitions/SubjectMaster"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "",
            "schema": {
              "$ref": "#/definitions/SubjectMaster"
            }
          }
        },
        "tags": [
          "academics"
        ]
      },
      "patch": {
        "operationId": "academics_subjects_partial_update",
        "description": "ViewSet for Subject Master (Subject Catalog)",
        "parameters": [
          {
            "name": "data",
            "in": "body",
            "required": true,
            "schema": {
              "$ref": "#/definitions/SubjectMaster"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "",
            "schema": {
              "$ref": "#/definitions/SubjectMaster"
            }
          }
        },
        "tags": [
          "academics"
        ]
      },
      "delete": {
        "operationId": "academics_subjects_delete",
        "description": "Delete subject - check if in use first",
        "parameters": [],
        "responses": {
          "204": {
            "description": ""
          }
        },
        "tags": [
          "academics"
        ]
      },
      "parameters": [
        {
          "name": "id",
          "in": "path",
          "description": "A unique integer value identifying this Subject Master.",
          "required": true,
          "type": "integer"
        }
      ]
    },
    "/system/auth/google-login/": {
      "post": {
        "operationId": "system_auth_google-login_create",
        "summary": "Google Login",
        "description": "Authenticate user with Google OAuth ID token",
        "parameters": [
          {
            "name": "data",
            "in": "body",
            "required": true,
            "schema": {
              "$ref": "#/definitions/GoogleLogin"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "",
            "schema": {
              "$ref": "#/definitions/LoginResponse"
            }
          },
          "400": {
            "description": "Bad Request",
            "schema": {
              "$ref": "#/definitions/MessageResponse"
            }
          }
        },
        "tags": [
          "Authentication"
        ]
      },
      "parameters": []
    },
    "/system/auth/login/": {
      "post": {
        "operationId": "system_auth_login_create",
        "summary": "User Login",
        "description": "Authenticate user with email and password",
        "parameters": [
          {
            "name": "data",
            "in": "body",
            "required": true,
            "schema": {
              "$ref": "#/definitions/Login"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "",
            "schema": {
              "$ref": "#/definitions/LoginResponse"
            }
          },
          "401": {
            "description": "Unauthorized",
            "schema": {
              "$ref": "#/definitions/MessageResponse"
            }
          },
          "400": {
            "description": "Bad Request",
            "schema": {
              "$ref": "#/definitions/MessageResponse"
            }
          }
        },
        "tags": [
          "Authentication"
        ]
      },
      "parameters": []
    },
    "/system/auth/logout/": {
      "get": {
        "operationId": "system_auth_logout_list",
        "summary": "User Logout",
        "description": "Logout current user and invalidate tokens",
        "parameters": [],
        "responses": {
          "200": {
            "description": "Success",
            "schema": {
              "$ref": "#/definitions/MessageResponse"
            }
          },
          "401": {
            "description": "Unauthorized",
            "schema": {
              "$ref": "#/definitions/MessageResponse"
            }
          }
        },
        "tags": [
          "Authentication"
        ]
      },
      "parameters": []
    },
    "/system/auth/register/user/": {
      "post": {
        "operationId": "system_auth_register_user_create",
        "summary": "User Registration",
        "description": "Register a new user account",
        "parameters": [
          {
            "name": "data",
            "in": "body",
            "required": true,
            "schema": {
              "$ref": "#/definitions/UserRegister"
            }
          }
        ],
        "responses": {
          "201": {
            "description": "Created",
            "schema": {
              "$ref": "#/definitions/MessageResponse"
            }
          },
          "400": {
            "description": "Bad Request",
            "schema": {
              "type": "object",
              "properties": {
                "field_name": {
                  "description": "List of validation errors for this field",
                  "type": "array",
                  "items": {
                    "type": "string"
                  }
                }
              }
            }
          }
        },
        "tags": [
          "Authentication"
        ]
      },
      "parameters": []
    },
    "/system/auth/resend-verification/": {
      "post": {
        "operationId": "system_auth_resend-verification_create",
        "summary": "Resend Verification Code",
        "description": "Resend verification code to email",
        "parameters": [
          {
            "name": "data",
            "in": "body",
            "required": true,
            "schema": {
              "$ref": "#/definitions/ResendVerification"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Success",
            "schema": {
              "$ref": "#/definitions/MessageResponse"
            }
          },
          "400": {
            "description": "Bad Request",
            "schema": {
              "$ref": "#/definitions/MessageResponse"
            }
          },
          "404": {
            "description": "Not Found",
            "schema": {
              "$ref": "#/definitions/MessageResponse"
            }
          }
        },
        "tags": [
          "Authentication"
        ]
      },
      "parameters": []
    },
    "/system/auth/verify-email/": {
      "post": {
        "operationId": "system_auth_verify-email_create",
        "summary": "Email Verification",
        "description": "Verify email address using OTP code",
        "parameters": [
          {
            "name": "data",
            "in": "body",
            "required": true,
            "schema": {
              "$ref": "#/definitions/EmailVerification"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Success",
            "schema": {
              "$ref": "#/definitions/MessageResponse"
            }
          },
          "400": {
            "description": "Bad Request",
            "schema": {
              "$ref": "#/definitions/MessageResponse"
            }
          },
          "404": {
            "description": "Not Found",
            "schema": {
              "$ref": "#/definitions/MessageResponse"
            }
          }
        },
        "tags": [
          "Authentication"
        ]
      },
      "parameters": []
    },
    "/system/auth/whoami/": {
      "get": {
        "operationId": "system_auth_whoami_list",
        "summary": "Get Current User",
        "description": "Get current authenticated user details",
        "parameters": [],
        "responses": {
          "200": {
            "description": "",
            "schema": {
              "$ref": "#/definitions/WhoAmIResponse"
            }
          },
          "401": {
            "description": "Unauthorized",
            "schema": {
              "$ref": "#/definitions/MessageResponse"
            }
          }
        },
        "tags": [
          "Authentication"
        ]
      },
      "parameters": []
    },
    "/system/health/": {
      "get": {
        "operationId": "system_health_list",
        "description": "Simple health check endpoint for monitoring system status",
        "parameters": [],
        "responses": {
          "200": {
            "description": ""
          }
        },
        "tags": [
          "system"
        ]
      },
      "parameters": []
    },
    "/system/staff/": {
      "get": {
        "operationId": "system_staff_list",
        "description": "List all staff with pagination",
        "parameters": [
          {
            "name": "role",
            "in": "query",
            "description": "",
            "required": false,
            "type": "string"
          },
          {
            "name": "is_active",
            "in": "query",
            "description": "",
            "required": false,
            "type": "string"
          },
          {
            "name": "gender",
            "in": "query",
            "description": "",
            "required": false,
            "type": "string"
          },
          {
            "name": "is_teacher",
            "in": "query",
            "description": "",
            "required": false,
            "type": "string"
          },
          {
            "name": "search",
            "in": "query",
            "description": "A search term.",
            "required": false,
            "type": "string"
          },
          {
            "name": "ordering",
            "in": "query",
            "description": "Which field to use when ordering the results.",
            "required": false,
            "type": "string"
          },
          {
            "name": "page",
            "in": "query",
            "description": "A page number within the paginated result set.",
            "required": false,
            "type": "integer"
          },
          {
            "name": "page_size",
            "in": "query",
            "description": "Number of results to return per page.",
            "required": false,
            "type": "integer"
          }
        ],
        "responses": {
          "200": {
            "description": "",
            "schema": {
              "required": [
                "count",
                "results"
              ],
              "type": "object",
              "properties": {
                "count": {
                  "type": "integer"
                },
                "next": {
                  "type": "string",
                  "format": "uri",
                  "x-nullable": true
                },
                "previous": {
                  "type": "string",
                  "format": "uri",
                  "x-nullable": true
                },
                "results": {
                  "type": "array",
                  "items": {
                    "$ref": "#/definitions/StaffList"
                  }
                }
              }
            }
          }
        },
        "tags": [
          "system"
        ]
      },
      "post": {
        "operationId": "system_staff_create",
        "description": "Create new staff member",
        "parameters": [
          {
            "name": "data",
            "in": "body",
            "required": true,
            "schema": {
              "$ref": "#/definitions/StaffCreateUpdate"
            }
          }
        ],
        "responses": {
          "201": {
            "description": "",
            "schema": {
              "$ref": "#/definitions/StaffCreateUpdate"
            }
          }
        },
        "tags": [
          "system"
        ]
      },
      "parameters": []
    },
    "/system/staff/teachers/active/": {
      "get": {
        "operationId": "system_staff_teachers_active_teachers",
        "description": "Get list of active teachers for dropdowns",
        "parameters": [
          {
            "name": "role",
            "in": "query",
            "description": "",
            "required": false,
            "type": "string"
          },
          {
            "name": "is_active",
            "in": "query",
            "description": "",
            "required": false,
            "type": "string"
          },
          {
            "name": "gender",
            "in": "query",
            "description": "",
            "required": false,
            "type": "string"
          },
          {
            "name": "is_teacher",
            "in": "query",
            "description": "",
            "required": false,
            "type": "string"
          },
          {
            "name": "search",
            "in": "query",
            "description": "A search term.",
            "required": false,
            "type": "string"
          },
          {
            "name": "ordering",
            "in": "query",
            "description": "Which field to use when ordering the results.",
            "required": false,
            "type": "string"
          },
          {
            "name": "page",
            "in": "query",
            "description": "A page number within the paginated result set.",
            "required": false,
            "type": "integer"
          },
          {
            "name": "page_size",
            "in": "query",
            "description": "Number of results to return per page.",
            "required": false,
            "type": "integer"
          }
        ],
        "responses": {
          "200": {
            "description": "",
            "schema": {
              "required": [
                "count",
                "results"
              ],
              "type": "object",
              "properties": {
                "count": {
                  "type": "integer"
                },
                "next": {
                  "type": "string",
                  "format": "uri",
                  "x-nullable": true
                },
                "previous": {
                  "type": "string",
                  "format": "uri",
                  "x-nullable": true
                },
                "results": {
                  "type": "array",
                  "items": {
                    "$ref": "#/definitions/ActiveTeacher"
                  }
                }
              }
            }
          }
        },
        "tags": [
          "system"
        ]
      },
      "parameters": []
    },
    "/system/staff/{id}/": {
      "get": {
        "operationId": "system_staff_read",
        "description": "Get staff details",
        "parameters": [],
        "responses": {
          "200": {
            "description": "",
            "schema": {
              "$ref": "#/definitions/StaffDetail"
            }
          }
        },
        "tags": [
          "system"
        ]
      },
      "put": {
        "operationId": "system_staff_update",
        "description": "Update staff (full update)",
        "parameters": [
          {
            "name": "data",
            "in": "body",
            "required": true,
            "schema": {
              "$ref": "#/definitions/StaffCreateUpdate"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "",
            "schema": {
              "$ref": "#/definitions/StaffCreateUpdate"
            }
          }
        },
        "tags": [
          "system"
        ]
      },
      "patch": {
        "operationId": "system_staff_partial_update",
        "description": "Partial update staff",
        "parameters": [
          {
            "name": "data",
            "in": "body",
            "required": true,
            "schema": {
              "$ref": "#/definitions/StaffCreateUpdate"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "",
            "schema": {
              "$ref": "#/definitions/StaffCreateUpdate"
            }
          }
        },
        "tags": [
          "system"
        ]
      },
      "delete": {
        "operationId": "system_staff_delete",
        "description": "Delete staff",
        "parameters": [],
        "responses": {
          "204": {
            "description": ""
          }
        },
        "tags": [
          "system"
        ]
      },
      "parameters": [
        {
          "name": "id",
          "in": "path",
          "description": "A unique integer value identifying this User.",
          "required": true,
          "type": "integer"
        }
      ]
    },
    "/system/staff/{id}/status/": {
      "patch": {
        "operationId": "system_staff_toggle_status",
        "description": "Toggle staff status (active/inactive)",
        "parameters": [
          {
            "name": "data",
            "in": "body",
            "required": true,
            "schema": {
              "$ref": "#/definitions/StaffStatusUpdate"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "",
            "schema": {
              "$ref": "#/definitions/StaffStatusUpdate"
            }
          }
        },
        "tags": [
          "system"
        ]
      },
      "parameters": [
        {
          "name": "id",
          "in": "path",
          "description": "A unique integer value identifying this User.",
          "required": true,
          "type": "integer"
        }
      ]
    },
    "/system/students/": {
      "get": {
        "operationId": "system_students_list",
        "description": "List students with pagination",
        "parameters": [
          {
            "name": "status",
            "in": "query",
            "description": "",
            "required": false,
            "type": "string"
          },
          {
            "name": "gender",
            "in": "query",
            "description": "",
            "required": false,
            "type": "string"
          },
          {
            "name": "student_class__name",
            "in": "query",
            "description": "",
            "required": false,
            "type": "string"
          },
          {
            "name": "section__name",
            "in": "query",
            "description": "",
            "required": false,
            "type": "string"
          },
          {
            "name": "search",
            "in": "query",
            "description": "A search term.",
            "required": false,
            "type": "string"
          },
          {
            "name": "ordering",
            "in": "query",
            "description": "Which field to use when ordering the results.",
            "required": false,
            "type": "string"
          },
          {
            "name": "page",
            "in": "query",
            "description": "A page number within the paginated result set.",
            "required": false,
            "type": "integer"
          },
          {
            "name": "page_size",
            "in": "query",
            "description": "Number of results to return per page.",
            "required": false,
            "type": "integer"
          }
        ],
        "responses": {
          "200": {
            "description": "",
            "schema": {
              "required": [
                "count",
                "results"
              ],
              "type": "object",
              "properties": {
                "count": {
                  "type": "integer"
                },
                "next": {
                  "type": "string",
                  "format": "uri",
                  "x-nullable": true
                },
                "previous": {
                  "type": "string",
                  "format": "uri",
                  "x-nullable": true
                },
                "results": {
                  "type": "array",
                  "items": {
                    "$ref": "#/definitions/StudentList"
                  }
                }
              }
            }
          }
        },
        "tags": [
          "system"
        ]
      },
      "post": {
        "operationId": "system_students_create",
        "description": "Create a new student",
        "parameters": [
          {
            "name": "data",
            "in": "body",
            "required": true,
            "schema": {
              "$ref": "#/definitions/StudentCreateUpdate"
            }
          }
        ],
        "responses": {
          "201": {
            "description": "",
            "schema": {
              "$ref": "#/definitions/StudentCreateUpdate"
            }
          }
        },
        "tags": [
          "system"
        ]
      },
      "parameters": []
    },
    "/system/students/placement/": {
      "post": {
        "operationId": "system_students_bulk_placement",
        "description": "Bulk student placement (promote/demote/transfer)",
        "parameters": [
          {
            "name": "data",
            "in": "body",
            "required": true,
            "schema": {
              "$ref": "#/definitions/StudentPlacement"
            }
          }
        ],
        "responses": {
          "201": {
            "description": "",
            "schema": {
              "$ref": "#/definitions/StudentPlacement"
            }
          }
        },
        "tags": [
          "system"
        ]
      },
      "parameters": []
    },
    "/system/students/{id}/": {
      "get": {
        "operationId": "system_students_read",
        "description": "ViewSet for Student CRUD operations",
        "parameters": [],
        "responses": {
          "200": {
            "description": "",
            "schema": {
              "$ref": "#/definitions/StudentDetail"
            }
          }
        },
        "tags": [
          "system"
        ]
      },
      "put": {
        "operationId": "system_students_update",
        "description": "Update student information",
        "parameters": [
          {
            "name": "data",
            "in": "body",
            "required": true,
            "schema": {
              "$ref": "#/definitions/StudentCreateUpdate"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "",
            "schema": {
              "$ref": "#/definitions/StudentCreateUpdate"
            }
          }
        },
        "tags": [
          "system"
        ]
      },
      "patch": {
        "operationId": "system_students_partial_update",
        "description": "ViewSet for Student CRUD operations",
        "parameters": [
          {
            "name": "data",
            "in": "body",
            "required": true,
            "schema": {
              "$ref": "#/definitions/StudentCreateUpdate"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "",
            "schema": {
              "$ref": "#/definitions/StudentCreateUpdate"
            }
          }
        },
        "tags": [
          "system"
        ]
      },
      "delete": {
        "operationId": "system_students_delete",
        "description": "ViewSet for Student CRUD operations",
        "parameters": [],
        "responses": {
          "204": {
            "description": ""
          }
        },
        "tags": [
          "system"
        ]
      },
      "parameters": [
        {
          "name": "id",
          "in": "path",
          "description": "A unique integer value identifying this Student.",
          "required": true,
          "type": "integer"
        }
      ]
    },
    "/system/students/{id}/status/": {
      "patch": {
        "operationId": "system_students_update_status",
        "description": "Update student status",
        "parameters": [
          {
            "name": "data",
            "in": "body",
            "required": true,
            "schema": {
              "$ref": "#/definitions/StudentDetail"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "",
            "schema": {
              "$ref": "#/definitions/StudentDetail"
            }
          }
        },
        "tags": [
          "system"
        ]
      },
      "parameters": [
        {
          "name": "id",
          "in": "path",
          "description": "A unique integer value identifying this Student.",
          "required": true,
          "type": "integer"
        }
      ]
    },
    "/system/users/": {
      "get": {
        "operationId": "system_users_list",
        "description": "",
        "parameters": [
          {
            "name": "search",
            "in": "query",
            "description": "A search term.",
            "required": false,
            "type": "string"
          },
          {
            "name": "ordering",
            "in": "query",
            "description": "Which field to use when ordering the results.",
            "required": false,
            "type": "string"
          },
          {
            "name": "page",
            "in": "query",
            "description": "A page number within the paginated result set.",
            "required": false,
            "type": "integer"
          },
          {
            "name": "page_size",
            "in": "query",
            "description": "Number of results to return per page.",
            "required": false,
            "type": "integer"
          }
        ],
        "responses": {
          "200": {
            "description": "",
            "schema": {
              "required": [
                "count",
                "results"
              ],
              "type": "object",
              "properties": {
                "count": {
                  "type": "integer"
                },
                "next": {
                  "type": "string",
                  "format": "uri",
                  "x-nullable": true
                },
                "previous": {
                  "type": "string",
                  "format": "uri",
                  "x-nullable": true
                },
                "results": {
                  "type": "array",
                  "items": {
                    "$ref": "#/definitions/UserBaseList"
                  }
                }
              }
            }
          }
        },
        "tags": [
          "system"
        ]
      },
      "parameters": []
    },
    "/system/users/{id}/": {
      "get": {
        "operationId": "system_users_read",
        "description": "",
        "parameters": [],
        "responses": {
          "200": {
            "description": "",
            "schema": {
              "$ref": "#/definitions/UserBaseDetail"
            }
          }
        },
        "tags": [
          "system"
        ]
      },
      "parameters": [
        {
          "name": "id",
          "in": "path",
          "description": "A unique integer value identifying this User.",
          "required": true,
          "type": "integer"
        }
      ]
    }
  },
  "definitions": {
    "ClassSection": {
      "required": [
        "name"
      ],
      "type": "object",
      "properties": {
        "id": {
          "title": "ID",
          "type": "integer",
          "readOnly": true
        },
        "is_active": {
          "title": "Is active",
          "type": "boolean"
        },
        "name": {
          "title": "Section Name",
          "type": "string",
          "maxLength": 10,
          "minLength": 1
        },
        "total_students": {
          "title": "Total Students",
          "type": "integer",
          "readOnly": true
        },
        "classroom_name": {
          "title": "Classroom name",
          "type": "string",
          "readOnly": true
        },
        "teacher": {
          "title": "Teacher",
          "description": "Class Teacher",
          "type": "integer",
          "x-nullable": true
        }
      }
    },
    "ClassSectionCreateUpdate": {
      "required": [
        "name",
        "classroom"
      ],
      "type": "object",
      "properties": {
        "is_active": {
          "title": "Is active",
          "type": "boolean"
        },
        "name": {
          "title": "Section Name",
          "type": "string",
          "maxLength": 10,
          "minLength": 1
        },
        "classroom": {
          "title": "Classroom",
          "type": "integer"
        },
        "teacher": {
          "title": "Teacher",
          "description": "Class Teacher",
          "type": "integer",
          "x-nullable": true
        }
      }
    },
    "ClassSubjectList": {
      "type": "object",
      "properties": {
        "id": {
          "title": "ID",
          "type": "integer",
          "readOnly": true
        },
        "subject_id": {
          "title": "Subject id",
          "type": "integer",
          "readOnly": true
        },
        "subject_name": {
          "title": "Subject name",
          "type": "string",
          "readOnly": true,
          "minLength": 1
        },
        "class_name": {
          "title": "Class name",
          "type": "string",
          "readOnly": true,
          "minLength": 1
        },
        "code": {
          "title": "Subject Code",
          "type": "string",
          "maxLength": 20,
          "x-nullable": true
        },
        "full_marks": {
          "title": "Full Marks",
          "type": "integer",
          "maximum": 2147483647,
          "minimum": -2147483648
        },
        "pass_marks": {
          "title": "Pass Marks",
          "type": "integer",
          "maximum": 2147483647,
          "minimum": -2147483648
        },
        "theory": {
          "title": "Theory",
          "type": "integer",
          "readOnly": true
        },
        "practical": {
          "title": "Practical",
          "type": "integer",
          "readOnly": true
        },
        "optional": {
          "title": "Optional",
          "type": "boolean",
          "readOnly": true
        }
      }
    },
    "ClassSubjectCreateUpdate": {
      "required": [
        "class_name",
        "subject_id"
      ],
      "type": "object",
      "properties": {
        "class_name": {
          "title": "Class name",
          "type": "string",
          "minLength": 1
        },
        "subject_id": {
          "title": "Subject id",
          "type": "integer"
        },
        "code": {
          "title": "Subject Code",
          "type": "string",
          "maxLength": 20,
          "x-nullable": true
        },
        "full_marks": {
          "title": "Full Marks",
          "type": "integer",
          "maximum": 2147483647,
          "minimum": -2147483648
        },
        "pass_marks": {
          "title": "Pass Marks",
          "type": "integer",
          "maximum": 2147483647,
          "minimum": -2147483648
        },
        "theory_marks": {
          "title": "Theory Marks",
          "type": "integer",
          "maximum": 2147483647,
          "minimum": -2147483648
        },
        "practical_marks": {
          "title": "Practical Marks",
          "type": "integer",
          "maximum": 2147483647,
          "minimum": -2147483648
        },
        "is_optional": {
          "title": "Is Optional",
          "type": "boolean"
        }
      }
    },
    "Classroom": {
      "required": [
        "name"
      ],
      "type": "object",
      "properties": {
        "id": {
          "title": "ID",
          "type": "integer",
          "readOnly": true
        },
        "sections": {
          "title": "Sections",
          "type": "string",
          "readOnly": true
        },
        "is_active": {
          "title": "Is active",
          "type": "boolean"
        },
        "created_at": {
          "title": "Created at",
          "type": "string",
          "format": "date-time",
          "readOnly": true
        },
        "updated_at": {
          "title": "Updated at",
          "type": "string",
          "format": "date-time",
          "readOnly": true
        },
        "name": {
          "title": "Classroom Name",
          "type": "string",
          "maxLength": 10,
          "minLength": 1
        }
      }
    },
    "ClassroomSections": {
      "required": [
        "classroom_name",
        "section_names"
      ],
      "type": "object",
      "properties": {
        "classroom_name": {
          "title": "Classroom name",
          "type": "string",
          "maxLength": 100,
          "minLength": 1
        },
        "section_names": {
          "type": "array",
          "items": {
            "type": "string",
            "maxLength": 100,
            "minLength": 1
          }
        },
        "teacher": {
          "title": "Teacher",
          "type": "integer",
          "x-nullable": true
        }
      }
    },
    "SubjectMaster": {
      "required": [
        "name"
      ],
      "type": "object",
      "properties": {
        "id": {
          "title": "ID",
          "type": "integer",
          "readOnly": true
        },
        "is_active": {
          "title": "Is active",
          "type": "boolean"
        },
        "created_at": {
          "title": "Created at",
          "type": "string",
          "format": "date-time",
          "readOnly": true
        },
        "updated_at": {
          "title": "Updated at",
          "type": "string",
          "format": "date-time",
          "readOnly": true
        },
        "name": {
          "title": "Subject Name",
          "type": "string",
          "maxLength": 100,
          "minLength": 1
        },
        "description": {
          "title": "Description",
          "type": "string",
          "x-nullable": true
        }
      }
    },
    "GoogleLogin": {
      "required": [
        "id_token"
      ],
      "type": "object",
      "properties": {
        "id_token": {
          "title": "Id token",
          "description": "Google OAuth ID token",
          "type": "string",
          "minLength": 1
        }
      }
    },
    "TokenResponse": {
      "description": "Authentication tokens",
      "required": [
        "access",
        "refresh"
      ],
      "type": "object",
      "properties": {
        "access": {
          "title": "Access",
          "description": "JWT access token",
          "type": "string",
          "minLength": 1
        },
        "refresh": {
          "title": "Refresh",
          "description": "JWT refresh token",
          "type": "string",
          "minLength": 1
        }
      }
    },
    "UserBaseDetail": {
      "description": "User details",
      "required": [
        "password",
        "email"
      ],
      "type": "object",
      "properties": {
        "id": {
          "title": "ID",
          "type": "integer",
          "readOnly": true
        },
        "password": {
          "title": "Password",
          "type": "string",
          "maxLength": 128,
          "minLength": 1
        },
        "last_login": {
          "title": "Last login",
          "type": "string",
          "format": "date-time",
          "x-nullable": true
        },
        "is_superuser": {
          "title": "Superuser status",
          "description": "Designates that this user has all permissions without explicitly assigning them.",
          "type": "boolean"
        },
        "uuid": {
          "title": "Uuid",
          "type": "string",
          "format": "uuid"
        },
        "email": {
          "title": "Email",
          "type": "string",
          "format": "email",
          "maxLength": 254,
          "minLength": 1
        },
        "user_type": {
          "title": "User type",
          "type": "string",
          "enum": [
            "staff",
            "superadmin"
          ]
        },
        "first_name": {
          "title": "First name",
          "type": "string",
          "maxLength": 100,
          "x-nullable": true
        },
        "middle_name": {
          "title": "Middle name",
          "type": "string",
          "maxLength": 100,
          "x-nullable": true
        },
        "last_name": {
          "title": "Last name",
          "type": "string",
          "maxLength": 100,
          "x-nullable": true
        },
        "phone_number": {
          "title": "Phone number",
          "type": "string",
          "maxLength": 30,
          "x-nullable": true
        },
        "profile_image": {
          "title": "Profile image",
          "type": "string",
          "readOnly": true,
          "x-nullable": true,
          "format": "uri"
        },
        "dob": {
          "title": "Dob",
          "type": "string",
          "format": "date",
          "x-nullable": true
        },
        "gender": {
          "title": "Gender",
          "type": "string",
          "enum": [
            "male",
            "female",
            "other"
          ],
          "x-nullable": true
        },
        "address": {
          "title": "Address",
          "type": "string",
          "x-nullable": true
        },
        "role": {
          "title": "Role",
          "type": "string",
          "enum": [
            "Teacher",
            "Admin",
            "Accountant",
            "Librarian",
            "Coordinator"
          ]
        },
        "qualification": {
          "title": "Qualification",
          "type": "string",
          "maxLength": 255,
          "x-nullable": true
        },
        "experience": {
          "title": "Experience",
          "type": "string",
          "maxLength": 100,
          "x-nullable": true
        },
        "specialization": {
          "title": "Specialization",
          "type": "string",
          "maxLength": 255,
          "x-nullable": true
        },
        "previous_school": {
          "title": "Previous school",
          "type": "string",
          "maxLength": 255,
          "x-nullable": true
        },
        "subjects": {
          "title": "Subjects",
          "type": "object"
        },
        "grades": {
          "title": "Grades",
          "type": "object"
        },
        "is_teacher": {
          "title": "Is teacher",
          "type": "boolean"
        },
        "is_email_verified": {
          "title": "Is email verified",
          "type": "boolean"
        },
        "is_active": {
          "title": "Is active",
          "type": "boolean"
        },
        "is_staff": {
          "title": "Is staff",
          "type": "boolean"
        },
        "is_2fa_enabled": {
          "title": "Is 2fa enabled",
          "type": "boolean"
        },
        "_secret": {
          "title": "secret",
          "type": "string",
          "maxLength": 255,
          "x-nullable": true
        },
        "last_email_sent_at": {
          "title": "Last email sent at",
          "type": "string",
          "format": "date-time",
          "x-nullable": true
        },
        "is_receiving_email": {
          "title": "Is receiving email",
          "type": "boolean"
        },
        "is_receiving_promotional_email": {
          "title": "Is receiving promotional email",
          "type": "boolean"
        },
        "created_at": {
          "title": "Created at",
          "type": "string",
          "format": "date-time",
          "readOnly": true
        },
        "updated_at": {
          "title": "Updated at",
          "type": "string",
          "format": "date-time",
          "readOnly": true
        },
        "social_provider": {
          "title": "Social provider",
          "type": "string",
          "maxLength": 255,
          "x-nullable": true
        },
        "social_provider_id": {
          "title": "Social provider id",
          "type": "string",
          "maxLength": 255,
          "x-nullable": true
        },
        "groups": {
          "description": "The groups this user belongs to. A user will get all permissions granted to each of their groups.",
          "type": "array",
          "items": {
            "description": "The groups this user belongs to. A user will get all permissions granted to each of their groups.",
            "type": "integer"
          },
          "uniqueItems": true
        },
        "user_permissions": {
          "description": "Specific permissions for this user.",
          "type": "array",
          "items": {
            "description": "Specific permissions for this user.",
            "type": "integer"
          },
          "uniqueItems": true
        }
      }
    },
    "LoginResponse": {
      "required": [
        "tokens",
        "user"
      ],
      "type": "object",
      "properties": {
        "tokens": {
          "$ref": "#/definitions/TokenResponse"
        },
        "user": {
          "$ref": "#/definitions/UserBaseDetail"
        }
      }
    },
    "MessageResponse": {
      "required": [
        "detail"
      ],
      "type": "object",
      "properties": {
        "detail": {
          "title": "Detail",
          "description": "Response message",
          "type": "string",
          "minLength": 1
        },
        "status": {
          "title": "Status",
          "description": "Status of the operation",
          "type": "boolean",
          "default": true
        }
      }
    },
    "Login": {
      "required": [
        "email",
        "password"
      ],
      "type": "object",
      "properties": {
        "email": {
          "title": "Email",
          "description": "User's email address",
          "type": "string",
          "format": "email",
          "minLength": 1
        },
        "password": {
          "title": "Password",
          "description": "User's password",
          "type": "string",
          "minLength": 1
        }
      }
    },
    "UserRegister": {
      "required": [
        "email",
        "password",
        "user_type"
      ],
      "type": "object",
      "properties": {
        "email": {
          "title": "Email",
          "type": "string",
          "format": "email",
          "minLength": 1
        },
        "password": {
          "title": "Password",
          "type": "string",
          "minLength": 8
        },
        "full_name": {
          "title": "Full name",
          "type": "string",
          "maxLength": 255,
          "minLength": 1
        },
        "user_type": {
          "title": "User type",
          "type": "string",
          "enum": [
            "customer",
            "staff"
          ]
        }
      }
    },
    "ResendVerification": {
      "required": [
        "email"
      ],
      "type": "object",
      "properties": {
        "email": {
          "title": "Email",
          "description": "Email address to resend verification code",
          "type": "string",
          "format": "email",
          "minLength": 1
        }
      }
    },
    "EmailVerification": {
      "required": [
        "email",
        "verification_code"
      ],
      "type": "object",
      "properties": {
        "email": {
          "title": "Email",
          "description": "Email address to verify",
          "type": "string",
          "format": "email",
          "minLength": 1
        },
        "verification_code": {
          "title": "Verification code",
          "description": "6-digit verification code",
          "type": "string",
          "maxLength": 6,
          "minLength": 6
        }
      }
    },
    "WhoAmIResponse": {
      "required": [
        "data"
      ],
      "type": "object",
      "properties": {
        "status": {
          "title": "Status",
          "description": "Status of the operation",
          "type": "boolean",
          "default": true
        },
        "data": {
          "$ref": "#/definitions/UserBaseDetail"
        }
      }
    },
    "StaffList": {
      "required": [
        "email"
      ],
      "type": "object",
      "properties": {
        "id": {
          "title": "ID",
          "type": "integer",
          "readOnly": true
        },
        "name": {
          "title": "Name",
          "type": "string",
          "readOnly": true
        },
        "first_name": {
          "title": "First name",
          "type": "string",
          "maxLength": 100,
          "x-nullable": true
        },
        "middle_name": {
          "title": "Middle name",
          "type": "string",
          "maxLength": 100,
          "x-nullable": true
        },
        "last_name": {
          "title": "Last name",
          "type": "string",
          "maxLength": 100,
          "x-nullable": true
        },
        "email": {
          "title": "Email",
          "type": "string",
          "format": "email",
          "maxLength": 254,
          "minLength": 1
        },
        "phone": {
          "title": "Phone",
          "type": "string",
          "readOnly": true,
          "minLength": 1
        },
        "dob": {
          "title": "Dob",
          "type": "string",
          "format": "date",
          "x-nullable": true
        },
        "gender": {
          "title": "Gender",
          "type": "string",
          "enum": [
            "male",
            "female",
            "other"
          ],
          "x-nullable": true
        },
        "address": {
          "title": "Address",
          "type": "string",
          "x-nullable": true
        },
        "role": {
          "title": "Role",
          "type": "string",
          "enum": [
            "Teacher",
            "Admin",
            "Accountant",
            "Librarian",
            "Coordinator"
          ]
        },
        "subjects": {
          "title": "Subjects",
          "type": "object"
        },
        "subject_names": {
          "title": "Subject names",
          "type": "string",
          "readOnly": true
        },
        "grades": {
          "title": "Grades",
          "type": "object"
        },
        "qualification": {
          "title": "Qualification",
          "type": "string",
          "maxLength": 255,
          "x-nullable": true
        },
        "experience": {
          "title": "Experience",
          "type": "string",
          "maxLength": 100,
          "x-nullable": true
        },
        "specialization": {
          "title": "Specialization",
          "type": "string",
          "maxLength": 255,
          "x-nullable": true
        },
        "previous_school": {
          "title": "Previous school",
          "type": "string",
          "maxLength": 255,
          "x-nullable": true
        },
        "status": {
          "title": "Status",
          "type": "string",
          "readOnly": true
        },
        "avatar_url": {
          "title": "Avatar url",
          "type": "string",
          "readOnly": true
        }
      }
    },
    "StaffCreateUpdate": {
      "required": [
        "first_name",
        "last_name",
        "email",
        "role"
      ],
      "type": "object",
      "properties": {
        "first_name": {
          "title": "First name",
          "type": "string",
          "maxLength": 100,
          "x-nullable": true
        },
        "middle_name": {
          "title": "Middle name",
          "type": "string",
          "maxLength": 100,
          "x-nullable": true
        },
        "last_name": {
          "title": "Last name",
          "type": "string",
          "maxLength": 100,
          "x-nullable": true
        },
        "email": {
          "title": "Email",
          "type": "string",
          "format": "email",
          "maxLength": 254,
          "minLength": 1
        },
        "phone": {
          "title": "Phone",
          "type": "string"
        },
        "dob": {
          "title": "Dob",
          "type": "string",
          "format": "date",
          "x-nullable": true
        },
        "gender": {
          "title": "Gender",
          "type": "string",
          "enum": [
            "male",
            "female",
            "other"
          ],
          "x-nullable": true
        },
        "address": {
          "title": "Address",
          "type": "string",
          "x-nullable": true
        },
        "role": {
          "title": "Role",
          "type": "string",
          "enum": [
            "Teacher",
            "Admin",
            "Accountant",
            "Librarian",
            "Coordinator"
          ]
        },
        "qualification": {
          "title": "Qualification",
          "type": "string",
          "maxLength": 255,
          "x-nullable": true
        },
        "experience": {
          "title": "Experience",
          "type": "string",
          "maxLength": 100,
          "x-nullable": true
        },
        "specialization": {
          "title": "Specialization",
          "type": "string",
          "maxLength": 255,
          "x-nullable": true
        },
        "previous_school": {
          "title": "Previous school",
          "type": "string",
          "maxLength": 255,
          "x-nullable": true
        },
        "subjects": {
          "title": "Subjects",
          "type": "object"
        },
        "grades": {
          "title": "Grades",
          "type": "object"
        },
        "profile_image": {
          "title": "Profile image",
          "type": "string",
          "readOnly": true,
          "x-nullable": true,
          "format": "uri"
        },
        "is_active": {
          "title": "Is active",
          "type": "boolean"
        },
        "password": {
          "title": "Password",
          "type": "string",
          "minLength": 1
        }
      }
    },
    "ActiveTeacher": {
      "type": "object",
      "properties": {
        "id": {
          "title": "ID",
          "type": "integer",
          "readOnly": true
        },
        "name": {
          "title": "Name",
          "type": "string",
          "readOnly": true
        }
      }
    },
    "StaffDetail": {
      "required": [
        "email"
      ],
      "type": "object",
      "properties": {
        "id": {
          "title": "ID",
          "type": "integer",
          "readOnly": true
        },
        "name": {
          "title": "Name",
          "type": "string",
          "readOnly": true
        },
        "avatar_url": {
          "title": "Avatar url",
          "type": "string",
          "readOnly": true
        },
        "phone": {
          "title": "Phone",
          "type": "string",
          "readOnly": true,
          "minLength": 1
        },
        "subject_names": {
          "title": "Subject names",
          "type": "string",
          "readOnly": true
        },
        "status": {
          "title": "Status",
          "type": "string",
          "readOnly": true
        },
        "password": {
          "title": "Password",
          "type": "string",
          "readOnly": true,
          "minLength": 1
        },
        "last_login": {
          "title": "Last login",
          "type": "string",
          "format": "date-time",
          "readOnly": true,
          "x-nullable": true
        },
        "is_superuser": {
          "title": "Superuser status",
          "description": "Designates that this user has all permissions without explicitly assigning them.",
          "type": "boolean",
          "readOnly": true
        },
        "uuid": {
          "title": "Uuid",
          "type": "string",
          "format": "uuid",
          "readOnly": true
        },
        "email": {
          "title": "Email",
          "type": "string",
          "format": "email",
          "maxLength": 254,
          "minLength": 1
        },
        "user_type": {
          "title": "User type",
          "type": "string",
          "enum": [
            "staff",
            "superadmin"
          ]
        },
        "first_name": {
          "title": "First name",
          "type": "string",
          "maxLength": 100,
          "x-nullable": true
        },
        "middle_name": {
          "title": "Middle name",
          "type": "string",
          "maxLength": 100,
          "x-nullable": true
        },
        "last_name": {
          "title": "Last name",
          "type": "string",
          "maxLength": 100,
          "x-nullable": true
        },
        "phone_number": {
          "title": "Phone number",
          "type": "string",
          "maxLength": 30,
          "x-nullable": true
        },
        "profile_image": {
          "title": "Profile image",
          "type": "string",
          "readOnly": true,
          "x-nullable": true,
          "format": "uri"
        },
        "dob": {
          "title": "Dob",
          "type": "string",
          "format": "date",
          "x-nullable": true
        },
        "gender": {
          "title": "Gender",
          "type": "string",
          "enum": [
            "male",
            "female",
            "other"
          ],
          "x-nullable": true
        },
        "address": {
          "title": "Address",
          "type": "string",
          "x-nullable": true
        },
        "role": {
          "title": "Role",
          "type": "string",
          "enum": [
            "Teacher",
            "Admin",
            "Accountant",
            "Librarian",
            "Coordinator"
          ]
        },
        "qualification": {
          "title": "Qualification",
          "type": "string",
          "maxLength": 255,
          "x-nullable": true
        },
        "experience": {
          "title": "Experience",
          "type": "string",
          "maxLength": 100,
          "x-nullable": true
        },
        "specialization": {
          "title": "Specialization",
          "type": "string",
          "maxLength": 255,
          "x-nullable": true
        },
        "previous_school": {
          "title": "Previous school",
          "type": "string",
          "maxLength": 255,
          "x-nullable": true
        },
        "subjects": {
          "title": "Subjects",
          "type": "object"
        },
        "grades": {
          "title": "Grades",
          "type": "object"
        },
        "is_teacher": {
          "title": "Is teacher",
          "type": "boolean"
        },
        "is_email_verified": {
          "title": "Is email verified",
          "type": "boolean"
        },
        "is_active": {
          "title": "Is active",
          "type": "boolean"
        },
        "is_staff": {
          "title": "Is staff",
          "type": "boolean"
        },
        "is_2fa_enabled": {
          "title": "Is 2fa enabled",
          "type": "boolean"
        },
        "_secret": {
          "title": "secret",
          "type": "string",
          "maxLength": 255,
          "x-nullable": true
        },
        "last_email_sent_at": {
          "title": "Last email sent at",
          "type": "string",
          "format": "date-time",
          "x-nullable": true
        },
        "is_receiving_email": {
          "title": "Is receiving email",
          "type": "boolean"
        },
        "is_receiving_promotional_email": {
          "title": "Is receiving promotional email",
          "type": "boolean"
        },
        "created_at": {
          "title": "Created at",
          "type": "string",
          "format": "date-time",
          "readOnly": true
        },
        "updated_at": {
          "title": "Updated at",
          "type": "string",
          "format": "date-time",
          "readOnly": true
        },
        "social_provider": {
          "title": "Social provider",
          "type": "string",
          "maxLength": 255,
          "x-nullable": true
        },
        "social_provider_id": {
          "title": "Social provider id",
          "type": "string",
          "maxLength": 255,
          "x-nullable": true
        },
        "groups": {
          "description": "The groups this user belongs to. A user will get all permissions granted to each of their groups.",
          "type": "array",
          "items": {
            "description": "The groups this user belongs to. A user will get all permissions granted to each of their groups.",
            "type": "integer"
          },
          "uniqueItems": true
        },
        "user_permissions": {
          "description": "Specific permissions for this user.",
          "type": "array",
          "items": {
            "description": "Specific permissions for this user.",
            "type": "integer"
          },
          "uniqueItems": true
        }
      }
    },
    "StaffStatusUpdate": {
      "required": [
        "status"
      ],
      "type": "object",
      "properties": {
        "status": {
          "title": "Status",
          "type": "string",
          "enum": [
            "active",
            "inactive"
          ]
        }
      }
    },
    "StudentList": {
      "required": [
        "first_name",
        "last_name",
        "dob",
        "gender",
        "admission_date"
      ],
      "type": "object",
      "properties": {
        "id": {
          "title": "ID",
          "type": "integer",
          "readOnly": true
        },
        "admission_number": {
          "title": "Admission Number",
          "type": "string",
          "maxLength": 50,
          "x-nullable": true
        },
        "first_name": {
          "title": "First Name",
          "type": "string",
          "maxLength": 100,
          "minLength": 1
        },
        "middle_name": {
          "title": "Middle Name",
          "type": "string",
          "maxLength": 100,
          "x-nullable": true
        },
        "last_name": {
          "title": "Last Name",
          "type": "string",
          "maxLength": 100,
          "minLength": 1
        },
        "full_name": {
          "title": "Full name",
          "type": "string",
          "readOnly": true,
          "minLength": 1
        },
        "email": {
          "title": "Email",
          "type": "string",
          "format": "email",
          "maxLength": 254,
          "x-nullable": true
        },
        "roll_no": {
          "title": "Roll Number",
          "type": "integer",
          "maximum": 2147483647,
          "minimum": -2147483648,
          "x-nullable": true
        },
        "student_class": {
          "title": "Student class",
          "type": "string",
          "readOnly": true,
          "minLength": 1
        },
        "section": {
          "title": "Section",
          "type": "string",
          "readOnly": true,
          "minLength": 1
        },
        "dob": {
          "title": "Date of Birth",
          "type": "string",
          "format": "date"
        },
        "gender": {
          "title": "Gender",
          "type": "string",
          "enum": [
            "male",
            "female",
            "other"
          ]
        },
        "avatar_url": {
          "title": "Avatar url",
          "type": "string",
          "readOnly": true,
          "minLength": 1
        },
        "parent_contact": {
          "title": "Parent contact",
          "type": "string",
          "readOnly": true,
          "minLength": 1
        },
        "admission_date": {
          "title": "Admission Date",
          "type": "string",
          "format": "date"
        },
        "status": {
          "title": "Status",
          "type": "string",
          "enum": [
            "active",
            "graduated",
            "transferred",
            "expelled"
          ]
        }
      }
    },
    "StudentCreateUpdate": {
      "required": [
        "first_name",
        "last_name",
        "dob",
        "gender",
        "admission_date"
      ],
      "type": "object",
      "properties": {
        "admission_number": {
          "title": "Admission Number",
          "type": "string",
          "maxLength": 50,
          "x-nullable": true
        },
        "first_name": {
          "title": "First Name",
          "type": "string",
          "maxLength": 100,
          "minLength": 1
        },
        "middle_name": {
          "title": "Middle Name",
          "type": "string",
          "maxLength": 100,
          "x-nullable": true
        },
        "last_name": {
          "title": "Last Name",
          "type": "string",
          "maxLength": 100,
          "minLength": 1
        },
        "email": {
          "title": "Email",
          "type": "string",
          "format": "email",
          "maxLength": 254,
          "x-nullable": true
        },
        "roll_no": {
          "title": "Roll Number",
          "type": "integer",
          "maximum": 2147483647,
          "minimum": -2147483648,
          "x-nullable": true
        },
        "student_class": {
          "title": "Student class",
          "type": "string"
        },
        "section": {
          "title": "Section",
          "type": "string"
        },
        "dob": {
          "title": "Date of Birth",
          "type": "string",
          "format": "date"
        },
        "gender": {
          "title": "Gender",
          "type": "string",
          "enum": [
            "male",
            "female",
            "other"
          ]
        },
        "avatar": {
          "title": "Avatar",
          "type": "string",
          "readOnly": true,
          "x-nullable": true,
          "format": "uri"
        },
        "address": {
          "title": "Address",
          "type": "string",
          "x-nullable": true
        },
        "admission_date": {
          "title": "Admission Date",
          "type": "string",
          "format": "date"
        },
        "status": {
          "title": "Status",
          "type": "string",
          "enum": [
            "active",
            "graduated",
            "transferred",
            "expelled"
          ]
        },
        "father_name": {
          "title": "Father Name",
          "type": "string",
          "maxLength": 100,
          "x-nullable": true
        },
        "father_phone": {
          "title": "Father Phone",
          "type": "string",
          "maxLength": 20,
          "x-nullable": true
        },
        "mother_name": {
          "title": "Mother Name",
          "type": "string",
          "maxLength": 100,
          "x-nullable": true
        },
        "mother_phone": {
          "title": "Mother Phone",
          "type": "string",
          "maxLength": 20,
          "x-nullable": true
        },
        "guardian_name": {
          "title": "Guardian Name",
          "type": "string",
          "maxLength": 100,
          "x-nullable": true
        },
        "guardian_relation": {
          "title": "Guardian Relation",
          "type": "string",
          "maxLength": 50,
          "x-nullable": true
        },
        "guardian_phone": {
          "title": "Guardian Phone",
          "type": "string",
          "maxLength": 20,
          "x-nullable": true
        },
        "previous_school": {
          "title": "Previous School",
          "type": "string",
          "maxLength": 255,
          "x-nullable": true
        },
        "notes": {
          "title": "Notes",
          "type": "string",
          "x-nullable": true
        }
      }
    },
    "StudentPlacement": {
      "required": [
        "student_ids",
        "action"
      ],
      "type": "object",
      "properties": {
        "student_ids": {
          "type": "array",
          "items": {
            "type": "integer"
          },
          "minItems": 1
        },
        "action": {
          "title": "Action",
          "type": "string",
          "enum": [
            "promote",
            "demote",
            "transfer"
          ]
        },
        "target_class": {
          "title": "Target class",
          "type": "string"
        },
        "target_section": {
          "title": "Target section",
          "type": "string"
        }
      }
    },
    "StudentDetail": {
      "required": [
        "first_name",
        "last_name",
        "dob",
        "gender",
        "admission_date"
      ],
      "type": "object",
      "properties": {
        "id": {
          "title": "ID",
          "type": "integer",
          "readOnly": true
        },
        "full_name": {
          "title": "Full name",
          "type": "string",
          "readOnly": true,
          "minLength": 1
        },
        "parent_contact": {
          "title": "Parent contact",
          "type": "string",
          "readOnly": true,
          "minLength": 1
        },
        "avatar_url": {
          "title": "Avatar url",
          "type": "string",
          "readOnly": true,
          "minLength": 1
        },
        "student_class": {
          "title": "Student class",
          "type": "string",
          "readOnly": true,
          "minLength": 1
        },
        "section": {
          "title": "Section",
          "type": "string",
          "readOnly": true,
          "minLength": 1
        },
        "is_active": {
          "title": "Is active",
          "type": "boolean"
        },
        "created_at": {
          "title": "Created at",
          "type": "string",
          "format": "date-time",
          "readOnly": true
        },
        "updated_at": {
          "title": "Updated at",
          "type": "string",
          "format": "date-time",
          "readOnly": true
        },
        "admission_number": {
          "title": "Admission Number",
          "type": "string",
          "maxLength": 50,
          "x-nullable": true
        },
        "first_name": {
          "title": "First Name",
          "type": "string",
          "maxLength": 100,
          "minLength": 1
        },
        "middle_name": {
          "title": "Middle Name",
          "type": "string",
          "maxLength": 100,
          "x-nullable": true
        },
        "last_name": {
          "title": "Last Name",
          "type": "string",
          "maxLength": 100,
          "minLength": 1
        },
        "email": {
          "title": "Email",
          "type": "string",
          "format": "email",
          "maxLength": 254,
          "x-nullable": true
        },
        "roll_no": {
          "title": "Roll Number",
          "type": "integer",
          "maximum": 2147483647,
          "minimum": -2147483648,
          "x-nullable": true
        },
        "dob": {
          "title": "Date of Birth",
          "type": "string",
          "format": "date"
        },
        "gender": {
          "title": "Gender",
          "type": "string",
          "enum": [
            "male",
            "female",
            "other"
          ]
        },
        "avatar": {
          "title": "Avatar",
          "type": "string",
          "readOnly": true,
          "x-nullable": true,
          "format": "uri"
        },
        "address": {
          "title": "Address",
          "type": "string",
          "x-nullable": true
        },
        "admission_date": {
          "title": "Admission Date",
          "type": "string",
          "format": "date"
        },
        "status": {
          "title": "Status",
          "type": "string",
          "enum": [
            "active",
            "graduated",
            "transferred",
            "expelled"
          ]
        },
        "father_name": {
          "title": "Father Name",
          "type": "string",
          "maxLength": 100,
          "x-nullable": true
        },
        "father_phone": {
          "title": "Father Phone",
          "type": "string",
          "maxLength": 20,
          "x-nullable": true
        },
        "mother_name": {
          "title": "Mother Name",
          "type": "string",
          "maxLength": 100,
          "x-nullable": true
        },
        "mother_phone": {
          "title": "Mother Phone",
          "type": "string",
          "maxLength": 20,
          "x-nullable": true
        },
        "guardian_name": {
          "title": "Guardian Name",
          "type": "string",
          "maxLength": 100,
          "x-nullable": true
        },
        "guardian_relation": {
          "title": "Guardian Relation",
          "type": "string",
          "maxLength": 50,
          "x-nullable": true
        },
        "guardian_phone": {
          "title": "Guardian Phone",
          "type": "string",
          "maxLength": 20,
          "x-nullable": true
        },
        "previous_school": {
          "title": "Previous School",
          "type": "string",
          "maxLength": 255,
          "x-nullable": true
        },
        "notes": {
          "title": "Notes",
          "type": "string",
          "x-nullable": true
        }
      }
    },
    "UserBaseList": {
      "required": [
        "email"
      ],
      "type": "object",
      "properties": {
        "id": {
          "title": "ID",
          "type": "integer",
          "readOnly": true
        },
        "email": {
          "title": "Email",
          "type": "string",
          "format": "email",
          "maxLength": 254,
          "minLength": 1
        },
        "full_name": {
          "title": "Full name",
          "type": "string",
          "readOnly": true
        },
        "user_type": {
          "title": "User type",
          "type": "string",
          "enum": [
            "staff",
            "superadmin"
          ]
        },
        "is_active": {
          "title": "Is active",
          "type": "boolean"
        },
        "is_email_verified": {
          "title": "Is email verified",
          "type": "boolean"
        },
        "created_at": {
          "title": "Created at",
          "type": "string",
          "format": "date-time",
          "readOnly": true
        },
        "updated_at": {
          "title": "Updated at",
          "type": "string",
          "format": "date-time",
          "readOnly": true
        }
      }
    }
  }
}