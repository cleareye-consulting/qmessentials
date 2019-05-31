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
                    'name' => $item->name,
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
            'name' => $request->input('name'),
            'password' => Hash::make($request->input('initial_password'))            
        ]);
        foreach ($request->input('roles') as $role_id) {
            DB::table('user_role')
                ->insert([
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
        $user = DB::table('users')->where('id', $id)->first();
        $user_roles = 
            DB::table('user_role')
            ->join('role','role.role_id','=','user_role.role_id')
            ->where('user_role.user_id', $id)
            ->pluck('role.role_id')
            ->toArray();
        $roles = DB::table('role')->get();
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
        DB::transaction(function() use ($request, $id) {
            if ($request->input('updated_password') != '') {
                Log::warn('Updating password for user ' . $id);
                DB::table('users')
                    ->where('id', $id)
                    ->update(['password' => Hash::make($request->input('initial_password'))]);                
            }
            $old_role_ids = DB::table('user_role')->where('user_id', $id)->pluck('role_id')->toArray();
            DB::table('user_role')
                ->where('user_id', $id)
                ->whereIn('role_id', $old_role_ids)
                ->delete();
            foreach ($request->input('roles') as $role_id) {
                DB::table('user_role')
                    ->insert([
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
        //
    }
}
