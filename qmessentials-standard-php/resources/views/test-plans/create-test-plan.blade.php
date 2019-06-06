@extends('layouts/app')

@section('title','Create Test Plan')

@section('content')    
    <div class="container">
    <h2 class="subtitle">Create Test Plan</h2>  
    <form class="form" action="/test-plans" method="POST">
        {{csrf_field()}}
        <div class="form-group">
            <label class="control-label" for="test_plan_name">Name</label>
            <input class="form-control" type="text" id="test_plan_name" name="test_plan_name" placeholder="Name"/>
        </div>
        <div class="form-group">
            <label class="control-label" for="duplicate_of_plan_id">Duplicate of</label>
            <select class="form-control" name="duplicate_of_plan_id" id="duplicate_of_plan_id">
                <option value="">None</option>
                @foreach($existing_test_plans as $existing_test_plan)
                    <option value="{{$existing_test_plan->test_plan_id}}">{{$existing_test_plan->test_plan_name}}</option>
                @endforeach
            </select>
        </div>
        <div class="form-group">
            <button class="btn btn-primary">Add Test Plan</button>
            <a class="btn btn-outline-primary" href="/test-plans">Cancel</a>
        </div>
    </form>
    </div>
@endsection