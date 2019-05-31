<?php

namespace App\Http\Controllers;

use App\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Hash;
use Illuminate\Foundation\Auth\RegistersUsers;


class UserController extends Controller
{
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
                    'username' => $item->username,
                    'roles' => []
                ];
            },
            DB::table('users')->get()->toArray()
        );
        $user_roles = 
            DB::table('user_role')
            ->join('role','role.role_id','=','user_role.role_id')
            ->select('user_role.user_id','role.role_name')
            ->get();
        foreach ($user_roles as $user_role) {
            foreach ($users as $user) {
                if ($user->user_id == $user_role->user_id) {
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
        $roles = DB::table('role')->get();
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
        $user = User::create([
            'name' => $request->input('username'),
            'password' => Hash::make($request->input('initial_password'))            
        ]);
        foreach ($request->input('roles') as $role_id) {
            DB::table('user_role')
                ->insert([
                    'user_id' => $user->id,
                    'role_id' => $role_id
                ]);    
        }
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
        //
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
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }
}
