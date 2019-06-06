@extends('layouts/app')

@section('title','Create Metric')

@section('content')    
    <div class="container">
    <h2 class="subtitle">Create Metric</h2>  
    <form class="form" action="/metrics" method="POST">
        {{csrf_field()}}
        <div class="form-group">
            <label class="control-label" for="metric_name">Name</label>
            <input class="form-control" type="text" id="metric_name" name="metric_name" placeholder="Name"/>
        </div>
        <div class="form-group">        
            <div class="form-check">
                <input class="form-check-input" type="checkbox" value="" id="has_multiple_results" name="has_multiple_results">
                <label class="form-check-label" for="has_multiple_results">
                    Has Multiple Results
                </label>
            </div>
        </div>
        <div class="form-group">
            <label class="control-label" for="available_qualifiers">Available Qualifiers</label>
            <input class="form-control" type="text" id="available_qualifiers" name="available_qualifiers"/>
        </div>
        <div class="form-group">
            <label class="control-label" for="available_units">Available Units</label>
            <input class="form-control" type="text" id="available_units" name="available_units"/>
        </div>
        <div class="form-group">
            <label class="control-label" for="industry_standards">Industry Standards</label>
            <textarea class="form-control" type="text" id="industry_standards" name="industry_standards"></textarea>
        </div>     
        <div class="form-group">
            <label class="control-label" for="methodology_references">Methodology References</label>
            <textarea class="form-control" type="text" id="methodology_references" name="methodology_references"></textarea>
        </div>      
        <div class="form-group">
            <button class="btn btn-primary">Add Metric</button>
            <a class="btn btn-outline-primary" href="/metrics">Cancel</a>
        </div>
    </form>
    </div>
@endsection