@extends('layouts/app')

@section('title','Users')

@section('content')
    <div class="container">
        <h2 class="subtitle">Users</h2>  
        @can('write-user')
        <table class="table table-bordered">
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Roles</th>
                </tr>
            </thead>
            <tbody>
            @foreach($users as $user) 
                <tr>
                    <td><a href="/users/{{$user->id}}/edit">{{$user->name}}</a></td>
                    <td>{{implode(', ', $user->roles)}}</td>
                </tr>
            @endforeach
            </tbody>
        </table>
        <div>
            <a href="/users/create">Add a User</a>
        </div>
        @endcan
        @cannot('write-user')
        <p class="lead">You must be in role 'Administrator' to view or edit users.</p>
        @endcannot
    </div>
@endsection