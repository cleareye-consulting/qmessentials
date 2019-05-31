@extends('layouts/app')

@section('title','Test Plans')

@section('content')
    <div class="container">
        <h2 class="subtitle">Test Plans</h2>
        @can('write-test-plan')  
        <table class="table table-bordered">
            <thead>
                <tr>
                    <th>Name</th>
                </tr>
            </thead>
            <tbody>
            @foreach($test_plans as $test_plan) 
                <tr>
                    <td><a href="/test-plans/{{$test_plan->test_plan_id}}/edit">{{$test_plan->test_plan_name}}</a></td>
                </tr>
            @endforeach
            </tbody>
        </table>
        <div>
            <a href="/test-plans/create">Add a Test Plan</a>
        </div>
        @endcan
        @cannot('write-test-plan')
        <p class="lead">You must be in role 'Analyst' to view or edit test plans.</p>
        @endcannot
    </div>
@endsection