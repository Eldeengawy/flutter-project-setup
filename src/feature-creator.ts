import * as fs from 'fs';
import * as path from 'path';

// Helper function to convert snake_case to PascalCase
function convertToPascalCase(snakeCase: string): string {
  return snakeCase
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');
}

// Helper function to convert snake_case to camelCase
function convertToCamelCase(snakeCase: string): string {
  const words = snakeCase.split('_');
  return words[0] + words.slice(1).map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('');
}

// Helper function to convert input to snake_case
function convertToSnakeCase(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/[\s\-]+/g, '_')
    .replace(/[^\w_]/g, '')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '');
}

// Get project name from workspace
function getProjectName(workspacePath: string): string {
  return path.basename(workspacePath);
}

// Convert project name to PascalCase
function getProjectPascalCase(projectName: string): string {
  return convertToPascalCase(projectName);
}

// Main function to create feature structure
export async function createFeatureStructure(featuresPath: string, workspacePath: string, featureName: string) {
  const snakeCaseFeature = convertToSnakeCase(featureName);
  const pascalCaseFeature = convertToPascalCase(snakeCaseFeature);
  const camelCaseFeature = convertToCamelCase(snakeCaseFeature);

  const projectName = getProjectName(workspacePath);
  const projectPascalCase = getProjectPascalCase(projectName);

  const featurePath = path.join(featuresPath, snakeCaseFeature);

  const directories = [
    path.join(featurePath, 'data', 'datasource'),
    path.join(featurePath, 'data', 'models', 'params'),
    path.join(featurePath, 'data', 'models', 'responses'),
    path.join(featurePath, 'data', 'repo'),
    path.join(featurePath, 'presentation', 'controller'),
    path.join(featurePath, 'presentation', 'ui')
  ];

  directories.forEach(dir => {
    fs.mkdirSync(dir, { recursive: true });
  });

  await createDataSourceFiles(featurePath, snakeCaseFeature, pascalCaseFeature, projectName);
  await createModelFiles(featurePath, snakeCaseFeature, pascalCaseFeature, projectName);
  await createRepoFiles(featurePath, snakeCaseFeature, pascalCaseFeature, projectName);
  await createControllerFiles(featurePath, snakeCaseFeature, pascalCaseFeature, projectName);
}

// Create UI template
export async function createUITemplate(featuresPath: string, workspacePath: string, featureName: string, templateType: string) {
  const snakeCaseFeature = convertToSnakeCase(featureName);
  const pascalCaseFeature = convertToPascalCase(snakeCaseFeature);
  const featurePath = path.join(featuresPath, snakeCaseFeature, 'presentation', 'ui');

  fs.mkdirSync(featurePath, { recursive: true });

  let uiContent = '';
  if (templateType === 'Login Page') {
    uiContent = `
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import '../controller/${snakeCaseFeature}_cubit.dart';

class ${pascalCaseFeature}Page extends StatelessWidget {
  const ${pascalCaseFeature}Page({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('${pascalCaseFeature}')),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            TextField(
              decoration: const InputDecoration(labelText: 'Email'),
            ),
            TextField(
              decoration: const InputDecoration(labelText: 'Password'),
              obscureText: true,
            ),
            ElevatedButton(
              onPressed: () {
                context.read<${pascalCaseFeature}Cubit>().create${pascalCaseFeature}(${pascalCaseFeature}Params());
              },
              child: const Text('Login'),
            ),
          ],
        ),
      ),
    );
  }
}
`;
  } else if (templateType === 'Dynamic List') {
    uiContent = `
import 'package:flutter/material.dart';
import '../controller/${snakeCaseFeature}_cubit.dart';
import '../controller/${snakeCaseFeature}_state.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

class ${pascalCaseFeature}Page extends StatelessWidget {
  const ${pascalCaseFeature}Page({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('${pascalCaseFeature} List')),
      body: BlocBuilder<${pascalCaseFeature}Cubit, ${pascalCaseFeature}State>(
        builder: (context, state) {
          if (state is ${pascalCaseFeature}Loading) {
            return const Center(child: CircularProgressIndicator());
          } else if (state is ${pascalCaseFeature}Success) {
            return ListView.builder(
              itemCount: 10,
              itemBuilder: (context, index) => ListTile(
                title: Text('Item \$index'),
              ),
            );
          } else if (state is ${pascalCaseFeature}Error) {
            return Center(child: Text(state.message));
          }
          return const Center(child: Text('Press a button to load data'));
        },
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () => context.read<${pascalCaseFeature}Cubit>().get${pascalCaseFeature}(${pascalCaseFeature}Params()),
        child: const Icon(Icons.refresh),
      ),
    );
  }
}
`;
  } else if (templateType === 'Profile Page') {
    uiContent = `
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import '../controller/${snakeCaseFeature}_cubit.dart';
import '../controller/${snakeCaseFeature}_state.dart';

class ${pascalCaseFeature}Page extends StatelessWidget {
  const ${pascalCaseFeature}Page({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('${pascalCaseFeature}')),
      body: BlocBuilder<${pascalCaseFeature}Cubit, ${pascalCaseFeature}State>(
        builder: (context, state) {
          if (state is ${pascalCaseFeature}Loading) {
            return const Center(child: CircularProgressIndicator());
          } else if (state is ${pascalCaseFeature}Success) {
            return Padding(
              padding: const EdgeInsets.all(16.0),
              child: Column(
                children: [
                  CircleAvatar(
                    radius: 50,
                    child: Text(state.${snakeCaseFeature}Model.name[0]),
                  ),
                  const SizedBox(height: 16),
                  Text('Name: \${state.${snakeCaseFeature}Model.name}'),
                  Text('Description: \${state.${snakeCaseFeature}Model.description}'),
                ],
              ),
            );
          } else if (state is ${pascalCaseFeature}Error) {
            return Center(child: Text(state.message));
          }
          return Center(child: Text('Load profile data'));
        },
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () => context.read<${pascalCaseFeature}Cubit>().get${pascalCaseFeature}(${pascalCaseFeature}Params()),
        child: const Icon(Icons.refresh),
      ),
    );
  }
}
`;
  }

  fs.writeFileSync(path.join(featurePath, `${snakeCaseFeature}_page.dart`), uiContent);
}

// Create datasource files
async function createDataSourceFiles(featurePath: string, snakeCaseFeature: string, pascalCaseFeature: string, projectName: string) {
  const dataSourceContent = `import '../../../../core/api/dio_client.dart';
import '../../../../core/api/end_points.dart';
import '../../../../core/api/response/response.dart';
import '../../../../core/extensions/token_to_authorization_options.dart';
import '../models/params/${snakeCaseFeature}_params.dart';
import '../models/responses/${snakeCaseFeature}_model.dart';

abstract class ${pascalCaseFeature}RemoteDataSource {
  Future<ApiResponse<${pascalCaseFeature}Model>> get${pascalCaseFeature}(${pascalCaseFeature}Params params);
  Future<ApiResponse<void>> create${pascalCaseFeature}(${pascalCaseFeature}Params params);
  Future<ApiResponse<void>> update${pascalCaseFeature}(${pascalCaseFeature}Params params);
  Future<ApiResponse<void>> delete${pascalCaseFeature}(String id);
}

class ${pascalCaseFeature}RemoteDataSourceImpl implements ${pascalCaseFeature}RemoteDataSource {
  final DioClient dioClient;

  ${pascalCaseFeature}RemoteDataSourceImpl(this.dioClient);

  @override
  Future<ApiResponse<${pascalCaseFeature}Model>> get${pascalCaseFeature}(${pascalCaseFeature}Params params) async {
    return dioClient.request<${pascalCaseFeature}Model>(
      method: RequestMethod.get,
      EndPoints.${snakeCaseFeature},
      queryParams: params.toJson(),
      fromJson: (json) => ${pascalCaseFeature}Model.fromJson(json as Map<String, dynamic>),
    );
  }

  @override
  Future<ApiResponse<void>> create${pascalCaseFeature}(${pascalCaseFeature}Params params) async {
    return dioClient.request<void>(
      method: RequestMethod.post,
      EndPoints.${snakeCaseFeature},
      data: params.toJson(),
      fromJson: (json) => (),
    );
  }

  @override
  Future<ApiResponse<void>> update${pascalCaseFeature}(${pascalCaseFeature}Params params) async {
    return dioClient.request<void>(
      method: RequestMethod.put,
      EndPoints.${snakeCaseFeature},
      data: params.toJson(),
      fromJson: (json) => (),
    );
  }

  @override
  Future<ApiResponse<void>> delete${pascalCaseFeature}(String id) async {
    return dioClient.request<void>(
      method: RequestMethod.delete,
      '\${EndPoints.${snakeCaseFeature}}/\$id',
      fromJson: (json) => (),
    );
  }
}
`;

  fs.writeFileSync(
    path.join(featurePath, 'data', 'datasource', `${snakeCaseFeature}_remote_datasource.dart`),
    dataSourceContent
  );
}

// Create model files
async function createModelFiles(featurePath: string, snakeCaseFeature: string, pascalCaseFeature: string, projectName: string) {
  const paramsContent = `class ${pascalCaseFeature}Params {
  final String? id;
  final String? name;
  final String? description;

  ${pascalCaseFeature}Params({
    this.id,
    this.name,
    this.description,
  });

  Map<String, dynamic> toJson() {
    return {
      if (id != null) 'id': id,
      if (name != null) 'name': name,
      if (description != null) 'description': description,
    };
  }

  factory ${pascalCaseFeature}Params.fromJson(Map<String, dynamic> json) {
    return ${pascalCaseFeature}Params(
      id: json['id'],
      name: json['name'],
      description: json['description'],
    );
  }

  ${pascalCaseFeature}Params copyWith({
    String? id,
    String? name,
    String? description,
  }) {
    return ${pascalCaseFeature}Params(
      id: id ?? this.id,
      name: name ?? this.name,
      description: description ?? this.description,
    );
  }
}
`;

  const responseModelContent = `class ${pascalCaseFeature}Model {
  final String id;
  final String name;
  final String description;
  final DateTime createdAt;
  final DateTime updatedAt;

  ${pascalCaseFeature}Model({
    required this.id,
    required this.name,
    required this.description,
    required this.createdAt,
    required this.updatedAt,
  });

  factory ${pascalCaseFeature}Model.fromJson(Map<String, dynamic> json) {
    return ${pascalCaseFeature}Model(
      id: json['id'],
      name: json['name'],
      description: json['description'],
      createdAt: DateTime.parse(json['created_at']),
      updatedAt: DateTime.parse(json['updated_at']),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'description': description,
      'created_at': createdAt.toIso8601String(),
      'updated_at': updatedAt.toIso8601String(),
    };
  }

  ${pascalCaseFeature}Model copyWith({
    String? id,
    String? name,
    String? description,
    DateTime? createdAt,
    DateTime? updatedAt,
  }) {
    return ${pascalCaseFeature}Model(
      id: id ?? this.id,
      name: name ?? this.name,
      description: description ?? this.description,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
    );
  }
}
`;

  fs.writeFileSync(
    path.join(featurePath, 'data', 'models', 'params', `${snakeCaseFeature}_params.dart`),
    paramsContent
  );

  fs.writeFileSync(
    path.join(featurePath, 'data', 'models', 'responses', `${snakeCaseFeature}_model.dart`),
    responseModelContent
  );
}

// Create repo files
async function createRepoFiles(featurePath: string, snakeCaseFeature: string, pascalCaseFeature: string, projectName: string) {
  const repoContent = `import 'dart:developer';

import 'package:dartz/dartz.dart';
import 'package:${projectName}/core/preferences/shared_pref.dart';

import '../../../../core/api/dio_client.dart';
import '../../../../core/api/end_points.dart';
import '../../../../core/api/response/response.dart';
import '../../../../core/errors/app_error.dart';
import '../../../../core/extensions/token_to_authorization_options.dart';
import '../datasource/${snakeCaseFeature}_remote_datasource.dart';
import '../models/params/${snakeCaseFeature}_params.dart';
import '../models/responses/${snakeCaseFeature}_model.dart';

abstract class ${pascalCaseFeature}Repo {
  Future<Either<${pascalCaseFeature}Model, AppError>> get${pascalCaseFeature}(${pascalCaseFeature}Params params);
  Future<Either<String, AppError>> create${pascalCaseFeature}(${pascalCaseFeature}Params params);
  Future<Either<String, AppError>> update${pascalCaseFeature}(${pascalCaseFeature}Params params);
  Future<Either<String, AppError>> delete${pascalCaseFeature}(String id);
}

class ${pascalCaseFeature}RepoImpl implements ${pascalCaseFeature}Repo {
  final ${pascalCaseFeature}RemoteDataSource _remoteDataSource;
  final ${convertToPascalCase(projectName)}Preferences _localDataSource;

  ${pascalCaseFeature}RepoImpl(this._remoteDataSource, this._localDataSource);

  @override
  Future<Either<${pascalCaseFeature}Model, AppError>> get${pascalCaseFeature}(${pascalCaseFeature}Params params) async {
    try {
      final response = await _remoteDataSource.get${pascalCaseFeature}(params);

      if (response.isSuccess) {
        return Left(response.data!);
      } else {
        return Right(AppError(message: response.errorMessage, apiResponse: response, type: ErrorType.api));
      }
    } catch (e) {
      return Right(AppError(message: e.toString(), type: ErrorType.unknown));
    }
  }

  @override
  Future<Either<String, AppError>> create${pascalCaseFeature}(${pascalCaseFeature}Params params) async {
    try {
      final response = await _remoteDataSource.create${pascalCaseFeature}(params);

      if (response.isSuccess) {
        return Left(response.message);
      } else {
        return Right(AppError(message: response.errorMessage, apiResponse: response, type: ErrorType.api));
      }
    } catch (e) {
      return Right(AppError(message: e.toString(), type: ErrorType.unknown));
    }
  }

  @override
  Future<Either<String, AppError>> update${pascalCaseFeature}(${pascalCaseFeature}Params params) async {
    try {
      final response = await _remoteDataSource.update${pascalCaseFeature}(params);

      if (response.isSuccess) {
        return Left(response.message);
      } else {
        return Right(AppError(message: response.errorMessage, apiResponse: response, type: ErrorType.api));
      }
    } catch (e) {
      return Right(AppError(message: e.toString(), type: ErrorType.unknown));
    }
  }

  @override
  Future<Either<String, AppError>> delete${pascalCaseFeature}(String id) async {
    try {
      final response = await _remoteDataSource.delete${pascalCaseFeature}(id);

      if (response.isSuccess) {
        return Left(response.message);
      } else {
        return Right(AppError(message: response.errorMessage, apiResponse: response, type: ErrorType.api));
      }
    } catch (e) {
      return Right(AppError(message: e.toString(), type: ErrorType.unknown));
    }
  }
}
`;

  fs.writeFileSync(
    path.join(featurePath, 'data', 'repo', `${snakeCaseFeature}_repo.dart`),
    repoContent
  );
}

// Create controller files
async function createControllerFiles(featurePath: string, snakeCaseFeature: string, pascalCaseFeature: string, projectName: string) {
  const cubitContent = `import 'package:equatable/equatable.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:${projectName}/core/api/response/response.dart';
import 'package:${projectName}/core/errors/app_error.dart';
import 'package:${projectName}/features/${snakeCaseFeature}/data/models/params/${snakeCaseFeature}_params.dart';
import 'package:${projectName}/features/${snakeCaseFeature}/data/models/responses/${snakeCaseFeature}_model.dart';
import 'package:${projectName}/features/${snakeCaseFeature}/data/repo/${snakeCaseFeature}_repo.dart';

part '${snakeCaseFeature}_state.dart';

class ${pascalCaseFeature}Cubit extends Cubit<${pascalCaseFeature}State> {
  final ${pascalCaseFeature}Repo _repo;
  ${pascalCaseFeature}Cubit(this._repo) : super(${pascalCaseFeature}Initial());

  static ${pascalCaseFeature}Cubit get(context) => BlocProvider.of<${pascalCaseFeature}Cubit>(context);

  /// Get ${pascalCaseFeature} data
  Future<void> get${pascalCaseFeature}(${pascalCaseFeature}Params params) async {
    try {
      emit(${pascalCaseFeature}Loading());
      final response = await _repo.get${pascalCaseFeature}(params);
      response.fold(
        (${snakeCaseFeature}Model) => emit(${pascalCaseFeature}Success(${snakeCaseFeature}Model)),
        (error) => emit(${pascalCaseFeature}Error(error.message))
      );
    } on AppError catch (e) {
      emit(${pascalCaseFeature}Error(e.message));
    } catch (e) {
      emit(${pascalCaseFeature}Error(e.toString()));
    }
  }

  /// Create new ${pascalCaseFeature}
  Future<void> create${pascalCaseFeature}(${pascalCaseFeature}Params params) async {
    try {
      emit(${pascalCaseFeature}Creating());
      final response = await _repo.create${pascalCaseFeature}(params);
      response.fold(
        (successMessage) => emit(${pascalCaseFeature}Created(successMessage)),
        (error) => emit(${pascalCaseFeature}Error(error.message)),
      );
    } on AppError catch (e) {
      emit(${pascalCaseFeature}Error(e.message));
    } catch (e) {
      emit(${pascalCaseFeature}Error(e.toString()));
    }
  }

  /// Update existing ${pascalCaseFeature}
  Future<void> update${pascalCaseFeature}(${pascalCaseFeature}Params params) async {
    try {
      emit(${pascalCaseFeature}Updating());
      final response = await _repo.update${pascalCaseFeature}(params);
      response.fold(
        (successMessage) => emit(${pascalCaseFeature}Updated(successMessage)),
        (error) => emit(${pascalCaseFeature}Error(error.message)),
      );
    } on AppError catch (e) {
      emit(${pascalCaseFeature}Error(e.message));
    } catch (e) {
      emit(${pascalCaseFeature}Error(e.toString()));
    }
  }

  /// Delete ${pascalCaseFeature}
  Future<void> delete${pascalCaseFeature}(String id) async {
    try {
      emit(${pascalCaseFeature}Deleting());
      final response = await _repo.delete${pascalCaseFeature}(id);
      response.fold(
        (successMessage) => emit(${pascalCaseFeature}Deleted(successMessage)),
        (error) => emit(${pascalCaseFeature}Error(error.message)),
      );
    } on AppError catch (e) {
      emit(${pascalCaseFeature}Error(e.message));
    } catch (e) {
      emit(${pascalCaseFeature}Error(e.toString()));
    }
  }
}
`;

  const stateContent = `part of '${snakeCaseFeature}_cubit.dart';

abstract class ${pascalCaseFeature}State extends Equatable {
  const ${pascalCaseFeature}State();

  @override
  List<Object> get props => [];
}

class ${pascalCaseFeature}Initial extends ${pascalCaseFeature}State {}

class ${pascalCaseFeature}Loading extends ${pascalCaseFeature}State {}

class ${pascalCaseFeature}Success extends ${pascalCaseFeature}State {
  final ${pascalCaseFeature}Model ${snakeCaseFeature}Model;

  const ${pascalCaseFeature}Success(this.${snakeCaseFeature}Model);

  @override
  List<Object> get props => [${snakeCaseFeature}Model];
}

class ${pascalCaseFeature}Creating extends ${pascalCaseFeature}State {}

class ${pascalCaseFeature}Created extends ${pascalCaseFeature}State {
  final String message;

  const ${pascalCaseFeature}Created(this.message);

  @override
  List<Object> get props => [message];
}

class ${pascalCaseFeature}Updating extends ${pascalCaseFeature}State {}

class ${pascalCaseFeature}Updated extends ${pascalCaseFeature}State {
  final String message;

  const ${pascalCaseFeature}Updated(this.message);

  @override
  List<Object> get props => [message];
}

class ${pascalCaseFeature}Deleting extends ${pascalCaseFeature}State {}

class ${pascalCaseFeature}Deleted extends ${pascalCaseFeature}State {
  final String message;

  const ${pascalCaseFeature}Deleted(this.message);

  @override
  List<Object> get props => [message];
}

class ${pascalCaseFeature}Error extends ${pascalCaseFeature}State {
  final String message;

  const ${pascalCaseFeature}Error(this.message);

  @override
  List<Object> get props => [message];
}
`;

  fs.writeFileSync(
    path.join(featurePath, 'presentation', 'controller', `${snakeCaseFeature}_cubit.dart`),
    cubitContent
  );

  fs.writeFileSync(
    path.join(featurePath, 'presentation', 'controller', `${snakeCaseFeature}_state.dart`),
    stateContent
  );
}
