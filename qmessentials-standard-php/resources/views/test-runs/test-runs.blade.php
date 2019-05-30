@extends('layouts/app')

@section('title','Test Runs')

@section('content')
    <div class="container">
        <h2 class="subtitle">Test Runs</h2>  
        <table class="table table-bordered">
            <thead>
                <tr>
                    <th>Created</th>
                    <th>Test Plan</th>
                    <th>Item #</th>
                    <th>Lot #</th>
                    <th>Product</th>
                    <th>&nbsp;</th>
                </tr>
            </thead>
            <tbody>
            @foreach($test_runs as $test_run) 
                <tr>
                    <td>{{$test_run->created_date}}</td>                    
                    <td>{{$test_run->test_plan_name}}</td>
                    <td>{{$test_run->item_number}}</td>
                    <td>{{$test_run->lot_number}}</td>
                    <td>{{$test_run->product_name}}</td>
                    <td><a href="/test-runs/{{$test_run->test_run_id}}/edit">Edit</a></td>
                </tr>
            @endforeach
            </tbody>
        </table>
        <div>
            <a href="/test-runs/create">Start a Test Run</a>
        </div>
    </div>
@endsection