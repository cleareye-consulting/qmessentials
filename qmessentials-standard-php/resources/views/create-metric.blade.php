@extends('layout')

@section('title','Create Metric')

@section('content')
    <h2 class="subtitle">Create Metric</h2>  
    <div class="container">
    <form action="/metrics" method="POST">
        {{csrf_field()}}
        <div class="field">
            <label class="label">Name</label>
            <div class="control">
                <input class="input" type="text" id="metric_name" name="metric_name" placeholder="Name">
            </div>
        </div>
        <div class="field">
            <div class="control">
                <label class="checkbox">
                    <input type="checkbox" id="has_multiple_results" name="has_multiple_results">Has Multiple Results
                </label>
            </div>
        </div>
        <div class="field">
            <div class="control">
                <button class="button">Submit</button>
            </div>
        </div>
    </form>
    </div>
@endsection