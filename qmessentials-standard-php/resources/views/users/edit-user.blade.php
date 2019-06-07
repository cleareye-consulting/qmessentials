@extends('layouts/app')

@section('title','Edit User')

@section('content')    
    <div class="container">
    <h2 class="subtitle">Edit User</h2>  
    <form class="form" action="/users/{{$user->id}}" method="POST">
        {{csrf_field()}}
        <input type="hidden" id="id" name="id" value="{{$user->id}}"/>
        <input type="hidden" name="_method" value="PUT">
        <div class="form-group">
            <label class="control-label" for="name">User Name</label>
            <input class="form-control" type="text" id="name" name="name" value="{{$user->name}}" disabled/>
        </div>      
        <div class="form-group">
            <label class="control-label" for="resetPassword"><input type="checkbox" id="resetPassword"/> Reset Password</label>
            <input class="form-control" type="text" id="updated_password" name="updated_password" disabled/>
        </div>      
        <div class="form-group">
            <label class="control-label" for="roles">Roles</label>
            <select class="form-control" name="roles[]" id="roles" multiple size="{{count($roles)}}">
                @foreach ($roles as $role)
                <option value="{{$role->role_id}}" {{in_array($role->role_id, $user_roles) ? 'selected' : ''}}>{{$role->role_name}}</option>
                @endforeach
            </select>
        </div>
        <div class="form-group">
            <button class="btn btn-primary">Save Changes</button>
            <a class="btn btn-outline-secondary" href="/users">Return to List</a>
        </div>
    </form>
    </div>
@endsection

@section('scripts')
    <script src="https://code.jquery.com/jquery-3.4.1.min.js" integrity="sha256-CSXorXvZcTkaix6Yvo6HppcZGetbYMGWSFlBw8HfCJo=" crossorigin="anonymous"></script>
    <script>
        $(() => { 
            getRandomPassword = () => {
                let result = '';
                const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%&*()-_+=';
                const charactersLength = characters.length;
                for ( let i = 0; i < 12; i++ ) {
                    result += characters.charAt(Math.floor(Math.random() * charactersLength));
                }
                return result;
            };
            $('#resetPassword').change(() => {
                if (($('#resetPassword').is(':checked'))) {
                    $('#updated_password').prop('disabled', false).val(getRandomPassword());
                }
                else {
                    $('#updated_password').prop('disabled', true).val(null);
                }
                
            });
         })
    </script>
@endsection