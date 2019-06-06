@extends('layouts/app')

@section('title','Create User')

@php

function getRandomPassword() { 
    $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%&*()-_+='; 
    $randomString = ''; 
  
    for ($i = 0; $i < 12; $i++) { 
        $index = rand(0, strlen($characters) - 1); 
        $randomString .= $characters[$index]; 
    } 
  
    return $randomString; 
} 

@endphp

@section('content')    
    <div class="container">
    <h2 class="subtitle">Create User</h2>  
    <form class="form" action="/users" method="POST">
        {{csrf_field()}}
        <div class="form-group">
            <label class="control-label" for="name">User Name</label>
            <input class="form-control" type="text" id="name" name="name"/>
        </div>      
        <div class="form-group">
            <label class="control-label" for="initial_password">Initial Password</label>
            <input class="form-control" type="text" id="initial_password" name="initial_password" value="{{getRandomPassword()}}"/>
        </div>      
        <div class="form-group">
            <label class="control-label" for="roles">Roles</label>
            <select class="form-control" name="roles[]" id="roles" multiple size="{{count($roles)}}">
                @foreach ($roles as $role)
                <option value="{{$role->role_id}}">{{$role->role_name}}</option>
                @endforeach
            </select>
        </div>
        <div class="form-group">
            <button class="btn btn-primary">Add User</button>
            <a class="btn btn-outline-primary" href="/users">Cancel</a>
        </div>
    </form>
    </div>
@endsection