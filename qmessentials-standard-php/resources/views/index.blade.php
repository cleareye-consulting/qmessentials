@extends('layouts/app')

@section('title','Home')

@section('content')
    <div class="container">
        <ul>
            <li><a href="metrics">Metrics</a></li>
            <li><a href="test-plans">Test Plans</a></li>
            <li><a href="products">Products</a></li>
            <li><a href="lots">Lots</a></li>
            <li><a href="test-runs">Test Runs</a></li>
        </ul>
    </div>
@endsection