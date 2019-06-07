<?php

namespace App\Http\Controllers;

use App\User;
use App\Role;
use App\UserRole;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Foundation\Auth\RegistersUsers;


class UserController extends Controller
{

    public function __construct()
    {
        $this->middleware('auth');
    }
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $users = array_map(
            function($item) {
                return (object) [
                    'id' => $item->id,
                    'name' => $item->name,
                    'roles' => []
                ];
            },
            DB::table('users')->get()->toArray()
        );
        $user_roles = 
            UserRole::join('role','role.role_id','=','user_role.role_id')
            ->select('user_role.user_id','role.role_name')
            ->get();
        foreach ($user_roles as $user_role) {
            foreach ($users as $user) {
                if ($user->id == $user_role->user_id) {
                    array_push($user->roles, $user_role->role_name);
                }
            }
        }
        return view('users/users', ['users' => $users]);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        if (Gate::denies('write-user')) {
            return redirect()->action('UserController@index');
        }
        $roles = Role::all();
        return view('users/create-user', ['roles' => $roles]);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        if (Gate::denies('write-user')) {
            return redirect()->action('UserController@index');
        }
        $user = User::create([
            'name' => $request->input('name'),
            'password' => Hash::make($request->input('initial_password'))            
        ]);
        foreach ($request->input('roles') as $role_id) {
            UserRole::create([
                'user_id' => $user->id,
                'role_id' => $role_id                
            ]);
        }
        return redirect()->action('UserController@index');
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        if (Gate::denies('write-user')) {
            return redirect()->action('UserController@index');
        }
        $user = DB::table('users')->where('id', $id)->first();
        $user_roles = 
            UserRole::all()
            ->join('role','role.role_id','=','user_role.role_id')
            ->where('user_role.user_id', $id)
            ->pluck('role.role_id')
            ->toArray();
        $roles = Role::all();
        return view('users/edit-user', ['user' => $user, 'user_roles' => $user_roles, 'roles' => $roles]);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        if (Gate::denies('write-user')) {
            return redirect()->action('UserController@index');
        }
        DB::transaction(function() use ($request, $id) {
            if ($request->input('updated_password') != '') {
                Log::warn('Updating password for user ' . $id);
                $user = Users::find($id);
                $user->password = Hash::make($request->updated_password);
                $user->save();
            }
            $old_role_ids = UserRole::where('user_id', $id)->pluck('role_id')->toArray();
            UserRole::where('user_id', $id)
                ->whereIn('role_id', $old_role_ids)
                ->delete();
            foreach ($request->input('roles') as $role_id) {
                UserRole::create([
                        'user_id' => $id,
                        'role_id' => $role_id
                ]);
            }
        });
        return redirect()->action('UserController@index');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        User::destroy($id);
    }
}
